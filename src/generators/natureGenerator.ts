
	import TileMap from '../tileMap';
	import TileSet from '../tileSet';
	import TileLayer from '../tileLayer';
	import TileType from '../tileType';
import BaseGenerator from './primary/baseGenerator';

	/**
	 * Generates some trees and rocks on the top tile layer.
	 */
export default class NatureGenerator extends BaseGenerator {

		/**
		 * number between 0 and 1 controlling how likely something is to generate.
		 * 1 generates an object in every space, if possible.
		 */
		public density:number = 0.05;

		// id of the castle wall tileType
		public CastleWallType:number;
	
		// id of the water tileType
		public WaterType:number;
	
		// id of the castle wall tileType
		public CastleType:number;
		
		public generate( map:TileMap ):void {

			super.generate( map );

			var baseLayer:TileLayer = map.getLayer( 0 );
			var topLayer:TileLayer = map.getLayer( 1 );

			var topSet:TileSet = TileSet.DefaulTop;
			var numTypes:number = topSet.size;

			var rows:number = map.rows;
			var cols:number = map.cols;

			var type:TileType;

			for( var r:number = 0; r < rows; r++ ) {

				for( var c:number = 0; c < cols; c++ ) {

					type = baseLayer.getTileType( r, c );
					if ( type && type.solid === true ) {
						continue;
					}
					type = topLayer.getTileType( r, c );
					if ( type && type.solid === true ) {
						continue;
					}
					if ( Math.random() > this.density ) {
						continue;
					}
					topLayer.setTileType( r, c, Math.floor( Math.random()*numTypes ) );

				} // for

			} // for-loop.
			
		} // Generate()
		
	} // class