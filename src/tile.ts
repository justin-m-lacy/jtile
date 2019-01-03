export default class Tile {

		public static last_search:number = 0;

		public get isEmpty() {
			return (this.tileTypeId === 0);
		}

		/**
		 * tile type.
		 */
		tileTypeId:number;

		/**
			orientation of tile, from 0 to 3, moving clockwise at 90degrees.
			0 is normal.
		**/
		public orientation:number;


		/// <summary>
		/// The searchId can be used to mark a tile during searches.
		/// It is not saved with tile data.
		/// It is not safe to conduct multiple searches simultaneously using
		/// searchId marking.
		/// </summary>
		public searchId:number;

		constructor( tileType:number=0, orient:number=0 ) {

			this.tileTypeId = tileType;
			this.orientation = orient || 1;
			this.searchId = Tile.last_search;
	
		}

		/**
		 * Tiles are considered equal if they are the same object,
		 * or they share the same tile Type.
		 * TODO: include orientation as well?
		 * @param other 
		 */
		public equals( other:Tile ):boolean {
			return ( this.tileTypeId === other.tileTypeId );
		}

		/**
		 * Get the size in bytes of an encoded tile.
		 * This can be updated if new properties are added to the tile.
		*/
		public static GetEncodeSize():number {
			return 2;
		}


} // class
