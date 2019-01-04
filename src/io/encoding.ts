import TileMap from '../tileMap';
import TileLayer from '../tileLayer';
import Tile from '../tile';
import TileSet from '../tileSet';

export const TileMapDecoder = {

		LEGACY_TILE_BYTES:6,

		/**
		takes the information from a MapData xml node and fills the given tileMap with the correct tile information.
		**/
		DecodeMapXML( xmlData:XMLNode ):TileMap {

			XmlNode child;

			let count:number= xmlData.NumChildren;
			if ( count <= 0 ) {
				return null;
			}

			let expectedRows:number= xmlData.GetIntAttribute( "rows" );
			let expectedCols:number= xmlData.GetIntAttribute( "cols" );

			let map:TileMap = new TileMap( count, expectedRows, expectedCols );

			let layerText:string;
			let tileBytes:number;
			let layer:TileLayer;

			let i:number= 0;
			for ( let child = xmlData.FirstChild; child != null; child = child.Next, i++ ) {

				layerText = child.NodeText;
				if ( layerText ) {
					console.log( "Error: Missing TileLayer data." );
					continue;
				}

				try {

					layer = map.getLayer( i );

					// expected size in bytes of each tile.
					tileBytes = child.GetIntAttribute( "tilesize", LEGACY_TILE_BYTES );
					layer.preferredSet = child.GetAttribute( "tileset", "default" );

					this.DecodeBase64Layer( map.getLayer( i ), layerText, tileBytes );


				} catch ( e:Error ) {
					console.log( "error: " + e.ToString() );
					throw new Error( "Error parsing map data." );
				}

			} // for-loop;

			return map;

		} // 

	 	DecodeBase64Layer( layer:TileLayer, stringData:string, tileSize:number):void {

			byte[] rawBytes = Convert.FromBase64String( stringData );
			this.DecodeTileLayer( layer, rawBytes, tileSize );

		} //

		/**
		 * tileSize is the size in bytes of each encoded tile.
		 */
		DecodeTileLayer( mapLayer:TileLayer, byte[] compressedData, tileSize:number):void {

			byte[] data = CLZF.Decompress( compressedData );

			using ( MemoryStream rawStream = new MemoryStream( data ) ) {

				// MIGHT need to flush here.
				BinaryReader reader = new BinaryReader( rawStream );
				let rows:number= reader.ReadInt32();
				let cols:number= reader.ReadInt32();

				// initialize map storage.
				// Only expand the map - never shrink - to ensure the layer isn't shrunk smaller than the containing map.
				mapLayer.expand( rows, cols );

				let padding:number= tileSize - 2;
				if ( padding < 0 ) { padding = 0; }

				let typeId:number;
				let orientation:number;

				for ( var r:number= 0; r < rows; r++ ) {

					for ( var c:number= 0; c < cols; c++ ) {

						typeId = reader.ReadByte();
						orientation = reader.ReadByte();

						// read back any remaining padding.
						if ( padding > 0 ) {
							reader.ReadBytes( padding );
						}

						mapLayer.SetTile( r, c, new Tile( typeId, orientation ) );

					} // for-loop.

				} // for-loop.

			} // using rawStream

		} //

	}

	class TileMapEncoder {

		public static XmlNode EncodeMapXML( map:TileMap ) {

			let count:number= map.layerCount;
			let layer:TileLayer;

			XmlNode root = new XmlNode( "mapData" );
			XmlNode child;

			root.SetAttribute( "rows", map.rows );
			root.SetAttribute( "cols", map.cols );

			let tileSize:number = Tile.GetEncodeSize();
			let set:TileSet;
	
			for( let i:number= 0; i < count; i++ ) {

				layer = map.getLayer( i );
				child = new XmlNode( "layer" );
				child.SetAttribute( "rows", layer.rows );
				child.SetAttribute( "cols", layer.cols );
				child.SetAttribute( "tilesize", tileSize );

				set = layer.tileSet;
				if ( set && !set.name ) {
					child.SetAttribute( "tileset", set.name );
				}

				child.NodeText = Convert.ToBase64String( EncodeTileLayer( layer, tileSize ) );

				root.AddChild( child );

			} //

			return root;

		} //

		public static EncodeBase64Layer( layer:TileLayer, tileSize:number):string {

			byte[] compressed = EncodeTileLayer( layer, tileSize );
			return Convert.ToBase64String( compressed );

		} //

		/*
		 */
		public static byte[] EncodeTileLayer( mapLayer:TileLayer, tileSize:number) {
			
			let rows:number= mapLayer.rows;
			let cols:number= mapLayer.cols;

			let expectedCapacity:number= rows*cols * tileSize;

			using ( MemoryStream stream = new MemoryStream( expectedCapacity ) ) {
				
				BinaryWriter writer = new BinaryWriter( stream );
				
				// write map size data. TODO: place high level data in xml?
				writer.Write( rows );
				writer.Write( cols );
				
				let tile:Tile;
				
				for( var r:number=0; r < rows; r++ ) {
					
					for( var c:number =0; c < cols; c++ ) {
						
						tile = mapLayer.getTile( r, c );
						writer.Write( tile.tileTypeId );
						writer.Write( tile.orientation );
						
					} // for-loop.
					
				} // for-loop.
				
				//console.log( "size pre-compress: " + stream.length );
				byte[] compressed = CLZF.Compress( stream.GetBuffer() );
				//return CLZF.Compress( stream.GetBuffer() );
				//console.log( "size after compress: " + compressed.length );
				
				return compressed;
				
			} // uncompressed stream
			
		} // Encode()

	}