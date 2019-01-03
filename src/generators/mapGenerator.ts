import TileSet from '../tileSet';
import BaseGenerator from './primary/baseGenerator';
import TileMap from '../tileMap';
import TileLayer from '../tileLayer';

	/**
	 * A map generator is a LevelGenerator that actually creates a TileMap.
	 * Other generators expect to have a TileMap created.
	 */
export default class MapGenerator extends BaseGenerator {

		private defaultBaseSet:string = "base_tiles";
		private defaultTopSet:string = "top_tiles";

		/**
		 * List of generators to run in sequence.
		 */
		private List<ILevelGenerator> generators;
		public AddGenerator( ILevelGenerator generator ):void {
			this.generators.Add( generator );
		}

		public RemoveGenerator( ILevelGenerator generator ):void {
			this.generators.Remove( generator );
		}

		public MapGenerator() {

			this.generators = new List<ILevelGenerator>();

		}

		public Generate( map:TileMap, loader:IAssetLoader ):void {

			super.generate( map, loader );

			var baseSet:TileSet = this.loadTileSet( this.defaultBaseSet );
			var topSet:TileSet = this.loadTileSet( this.defaultTopSet );
	
			TileSet.SetDefaults( baseSet, topSet );

			this.curMap = this.createMap( level );

		}

		/**
		 * Run the sub-generators associated with this map generator.
		 */
		protected RunGenerators():void {

			for ( generator of this.generators ) {
				generator.generate( this.curMap, this.loader );
			}

		}

		protected loadTileSet( name:string ):TileSet {

			if ( !name ) return null;

			var set:TileSet = TileLoader.LoadXml( this.loader, "XML/" + name + ".xml" );
			if ( set == null ) {
				console.log( "Error: set not found: " + name );
			}
			return set;

		}

		/**
		 * Load tile sets based on the preferred sets listed in every tile layer?
		 */
		protected loadMapSets( map:TileMap ):void {

			var len:number = map.layerCount;
			var layer:TileLayer;
			var set:TileSet;

			for ( var i:number = 0; i < len; i++ ) {

				layer = map.getLayer( i );
				if ( layer.tileSet != null ) {
					// layer might be allowed to be specified directly in the level.xml file.
					continue;
				}
				if ( !layer.preferredSet ) continue;
	
				set = TileLoader.LoadXml( this.loader, "XML/" + layer.preferredSet + ".xml" );
				if ( set == null ) {

					// TODO: set default.

				}
				layer.tileSet = set;

			} // for-loop.

		}

		protected CreateMap():TileMap {

			var mapProps:CustomProps = level.generatorProps;

			var rows:number = level.TileRows;
			var cols:number = level.TileCols;

			if ( mapProps != null ) {

				console.log( "building from props" );
				var minRows:number = mapProps.GetInt( "minrows" );
				var maxRows:number = mapProps.GetInt( "maxrows" );
				if ( minRows > 0 && maxRows > 0 ) {
					rows = minRows + Math.random()*( maxRows - minRows ) + 1;

				}

				var minCols:number = mapProps.GetInt( "mincols" );
				var maxCols:number = mapProps.GetInt( "maxcols" );
				if ( minRows > 0 && maxRows > 0 ) {
					cols =  minCols + Math.random()*( maxCols - minCols ) + 1;
				}

			}
			//console.log( "rows: " + rows + " cols: " + cols );

			return new TileMap( 2, rows, cols );

		} // CreateMap()

	} // class
