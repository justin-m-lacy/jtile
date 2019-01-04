import TileType from '../../tileType';
import TileMap from '../../tileMap';
import TileLayer from '../../tileLayer';
import BaseGenerator from './baseGenerator';
import { random } from '../../util/array';

export default class OutdoorGenerator extends BaseGenerator {

		/**
		 * valid tile types for base terrain.
		 */
		public terrainTypes:TileType[];

		/**
		 * valid tile types for map features.
		 */
		public featureTypes:TileType[];

		public generate( map:TileMap ):void {

			super.generate( map );

			this.fillBaseTiles( this.terrainTypes );

			this.linkAll();

		}

		/**
		 * start by filling the base with random tile types.
		 */
		private fillBaseTiles( types:TileType[] ):void {

			var rows:number = this.curMap.rows;
			var cols:number = this.curMap.cols;
			var numTypes:number = types.length;

			var baseLayer:TileLayer = this.curMap.getLayer( 0 );

			for ( var r:number = 0; r < rows; r++ ) {

				for ( var c:number = 0; c < cols; c++ ) {

					baseLayer.setTileType( r, c, random(types).id );
				}

			}

		}

	} // class