import TileMap from '../tileMap';
import Hallway from './hallway';
import TileCoord from '../tileCoord';

/**
* not sure if ill keep. just using for map generation.
*/
export default class RoomData {

		public minRow:number;
		public minCol:number;

		/**
		 * maxRow, maxCol ARE included in the range of tile indices making the room.
		 */
		public maxRow:number;
		public maxCol:number;

		/**
		 * used to find out information about a room: empty, occupied, stairs, etc.
		 */
		private parentMap:TileMap;

				/**
		 * Coordinates of room exits - outside the room, not inside.
		 */
		public halls:Hallway[];

		/**
		 * room rows, cols:   r0 <= r <= r1    c0 <= c <= c1
		 */
		constructor( map:TileMap, r0:number, c0:number, r1:number, c1:number ) {

			this.parentMap = map;

			this.minRow = r0;
			this.minCol = c0;
			this.maxRow = r1;
			this.maxCol = c1;

			this.halls = new Hallway[0]();

		} //

		public addExit( hall:Hallway ):void {

			this.halls.push( hall );

		}

		public getWidth():number {
			return ( this.maxCol - this.minCol ) + 1;
		}

		public getHeight():number {
			return ( this.maxRow - this.minRow ) + 1;
		}

		/**
		 * returns a random location within the room.
		 *
		 * locations are tested sequentially from a random pountil:number
		 * an unoccupied space is found. returns false if no space is found.
		 */
		public getRandEmpty( tile:TileCoord ):boolean {

			let success:boolean = true;

			var beginRow:number = this.minRow + Math.random()*( this.maxRow -this.minRow);
			var beginCol:number = this.minCol + Math.random()*( this.maxCol - this.minCol );

			var r:number = beginRow;
			var c:number = beginCol;

			while ( this.parentMap.getTile( r,c,1 ).tileTypeId != 0 ) {

				r++;
				if ( r >= this.parentMap.rows ) {
					r = 0;
				}
				c++;
				if ( c >= this.parentMap.cols ) {
					c = 0;
				}

				if ( r == beginRow && c == beginCol ) {
					success = false;
					break;
				}

			} //

			tile = new TileCoord( r, c );
			return success;

		} //

		/**
		 * returns true if there are no creatures, items, or special features in the room.
		 */
		public isEmpty():boolean {

			for ( var r:number = this.minRow; r <= this.maxRow; r++ ) {

				for ( var c:number = this.minCol; c <= this.maxCol; c++ ) {

					if ( this.parentMap.isEmpty(r,c) === false ) return false;

				} //

			} //

			return true;

		} //

		public isOccupied():boolean {

			for ( var r:number = this.minRow; r <= this.maxRow; r++ ) {

				for ( var c:number = this.minCol; c <= this.maxCol; c++ ) {

					if ( this.parentMap.isBlocked(r,c) === true ) return true;

				} //

			} //

			return false;

		} //

		public overlaps( room:RoomData ):boolean {

			if ( room.minRow > this.maxRow || room.maxRow < this.minRow ) {
				return false;
			}

			if ( room.minCol > this.maxCol || room.maxCol < this.minCol ) {
				return false;
			}

			return true;

		} //

		/**
		 * get a random row shared by both rooms.
		 * returns -1 if no overlapping row.
		 */
		public getOverlapRow( room:RoomData ):number {

			if ( room.minRow > this.minRow ) {

				// given room starts AFTER this room.
				var max:number = this.maxRow;
				if ( room.minRow > max ) {
					return -1;
				}

				if ( room.maxRow < max ) {
					max = room.maxRow;
				}

				return room.minRow + Math.floor( Math.random() * ( max - room.minRow ) );

			} else {

				// dr < 0 means the given room starts BEFORE this room.
				// make sure the room extends at least to this room's start.

				var max:number = room.maxRow;
				if ( this.minRow > max ) {
					// room row-extent doesn't make it to this room.
					return -1;
				}

				// of the two overlapping rooms, find the one that ends first.
				if ( max > this.maxRow ) {
					max = this.maxRow;
				}

				return this.minRow + Math.floor( Math.random() * ( max - this.minRow ) );

			} //

		} //

		/**
		 * get a random row shared by both rooms.
		 * returns -1 if no overlapping row.
		 */
		public getOverlapCol( room:RoomData ):number {

			if ( room.minCol > this.minCol ) {

				// given room starts AFTER this room.
				var max:number = this.maxCol;
				if ( room.minCol > max ) {
					return -1;
				}

				if ( room.maxCol < max ) {
					max = room.maxCol;
				}

				return room.minCol + Math.floor( Math.random() * ( max - room.minCol ) );

			} else {

				// dr < 0 means the given room starts BEFORE this room.
				// make sure the room extends at least to this room's start.

				var max:number = room.maxCol;
				if ( this.minCol > max ) {
					// room row-extent doesn't make it to this room.
					return -1;
				}

				// of the two overlapping rooms, find the one that ends first.
				if ( max > this.maxCol ) {
					max = this.maxCol;
				}

				return this.minCol + Math.floor( Math.random() * ( max - this.minCol ) );

			} //

		} //

		public rowOverlaps( room:RoomData ):boolean {

			if ( room.minRow > this.maxRow || room.maxRow < this.minRow ) {
				return false;
			}

			return true;

		} //

		public colOverlaps( room:RoomData ):boolean {

			if ( room.minCol > this.maxCol || room.maxCol < this.minCol ) {
				return false;
			}

			return true;

		} //

	}