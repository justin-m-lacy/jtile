import TileLayer from '../tileLayer';
import TileType from '../tileType';
import TileCoord from '../tileCoord';
import ITileRegion from './iTileRegion';

export default class RegionList implements ITileRegion {

		regions:ITileRegion[];

		constructor( tileCoords:ITileRegion[] ) {

			this.regions = new ITileRegion[ tileCoords ]();

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

		/*public IIterator<TileCoord> GetIterator() {
			return new UniqueIterator<TileCoord>( this.regions.ToArray() );
		}

		IIterator IEnumerable.GetIterator() {
			return new UniqueIterator<TileCoord>( this.regions.ToArray() );
		}*/
	

		public getSize():number {

			var count:number = 0;

			//cant just loop through regions because some tiles could appear in multiple regions.
			using ( IIterator < TileCoord> Iterator = this.GetIterator() ){

				while ( Iterator.MoveNext() ) {
					count++;
				}
			}

			return count;

		}

	} // class