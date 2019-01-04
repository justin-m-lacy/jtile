import TileSet from '../tileSet';
import BaseGenerator from './primary/baseGenerator';
import TileMap from '../tileMap';
import TileLayer from '../tileLayer';


/**
 * Generator that generates an initial tile map.
 */
export default class MapGenerator extends BaseGenerator {

		public maxRows:number;
		public maxCols:number;
	
		public constructor( maxRows:number=0, maxCols:number=0 ) {

			super();
	
			this.maxRows = maxRows;
			this.maxCols = maxCols;

		}

		public generate( map:TileMap ):void {

			super.generate( map );


			this.curMap = this.createMap();

		}

		protected createMap():TileMap {

			var rows:number = this.maxRows;
			var cols:number = this.maxCols;

			return new TileMap( 2, rows, cols );

		} // CreateMap()

	} // class
