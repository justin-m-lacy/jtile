import TileCoord from '../tileCoord';
import ITileRegion from './iTileRegion';
import { UniqueIterator } from './iterators';

export default class RegionList implements ITileRegion {

		regions:ITileRegion[];

		constructor( tileCoords:ITileRegion[]=null ) {

			this.regions = tileCoords || [];

		}

		public has( coord:TileCoord ):boolean {

			for ( var region of this.regions ) {
				if ( region.has( coord ) === true ) {
					return true;
				}
			}
			return false;

		}

		public contains( r:number, c:number ):boolean {

			for ( var region of this.regions ) {
				if ( region.contains( r, c ) ) {
					return true;
				}
			}
			return false;

		}

		public addRegion( t:ITileRegion ):void {
			this.regions.push( t );
		}

		public pickTile():TileCoord {

			return this.regions[ Math.floor( Math.random()*this.regions.length ) ].pickTile();

		}

		*[Symbol.iterator]():Iterator<TileCoord> {
			return new UniqueIterator( this.regions );
		}
	

		public getSize():number {

			var count:number = 0;

			//cant just loop through regions because some tiles could appear in multiple regions.
			for ( var tileCoord in this ){
				count++;
			}

			return count;

		}

	} // class