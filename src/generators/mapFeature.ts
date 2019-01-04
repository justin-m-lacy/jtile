import TileType from '../tileType';
import TileMap from '../tileMap';
import TileRect from '../tileRect';
import ITileRegion from '../regions/iTileRegion';
import RegionMaker from './regionMaker';

	/**
	 * Describes a feature on the map.
	 */
export default class MapFeature {

		private areaType:string;

		/**
		 * types of tiles that can be used.
		 */
		//private tileTypes:TileType[];

		/**
		 * minimum size of the feature as a percentage of the map rows/cols.
		 */
		private minSizePct:number = 0.2;
		/**
		 * maximum size of the feature as a percentage of the map rows/cols.
		 */
		private maxSizePct:number = 0.5;

		constructor( regionType:string, tiles:TileType[] ) {

			this.areaType = regionType;
			//this.tileTypes = tiles;

		}

		public CreateRegion( map:TileMap ):ITileRegion {

			var rowPct:number = this.minSizePct + Math.random()*( this.maxSizePct - this.minSizePct );
			var colPct:number = this.minSizePct + Math.random()*( this.maxSizePct - this.minSizePct );


			// region starts at 0 and is moved up by (1-pct)*Random.
			var rowStart:number = Math.random() * ( 1 - rowPct );
			var colStart:number = Math.random() * ( 1 - colPct );

			var bounds:TileRect = new TileRect( Math.floor( rowStart * map.rows ), Math.floor(colStart * map.cols),
									Math.floor( ( rowStart + rowPct ) * map.rows ),
									Math.floor( ( colStart + colPct ) * map.cols ) );
	
			var maker:RegionMaker = new RegionMaker( bounds, this.areaType );

			return maker.generate();

		}


	}