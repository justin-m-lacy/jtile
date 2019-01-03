import Direction from '../search/direction';

export default {

		/**
		 * Get a random turn. (Change of direction by 90 degrees.)
		 */
		getTurn( dir:Direction ):Direction {

			let r:number = Math.random();

			switch ( dir ) {

				case Direction.DOWN:
				case Direction.UP:
					if ( r < 0.5 ) {
						return TileDirection.RIGHT;
					} else {
						return TileDirection.LEFT;
					}
				case Direction.LEFT:
				case Direction.RIGHT:
				default:
					if ( r < 0.5 ) {
						return Direction.UP;
					} else {
						return Direction.DOWN;
					}

			}

		}

		/**
		 * Returns a random TileDirection.
		 */
		Direction():Direction {

			let val:number = Math.random();
			if ( val < 0.25 ) {
				return Direction.UP;
			} else if ( val < 0.5 ) {
				return Direction.LEFT;
			} else if ( val < 0.75 ) {
				return Direction.DOWN;
			}
			return Direction.RIGHT;

		}

		/**
		 * checks the layers from highest to lowest and returns the first random tile found in range
		 * that is empty on all layers.
		*/
		RandomEmpty( map:TileMap, range:TileRect ):boolean|TileCoord {

			let r:number = UnityEngine.Random.Range( range.minRow, range.maxRow );
			let c:number = UnityEngine.Random.Range( range.minCol, range.maxCol );

			if ( map.isEmpty( r, c ) ) {
				return new TileCoord( r, c );
			}

			let max:number = range.getSize();
			let count:number = 1;

			while ( count < max ) {

				c++;
				if ( c >= range.maxCol ) {
					c = range.minCol;
					r++;
					if ( r >= range.maxRow ) {
						r = range.minRow;
					}
				}

				if ( map.isEmpty( r, c ) ) {
					return new TileCoord( r, c );
				}
				count++;

			} //

			return false;

		} //

		/**
		 * returns a random empty tile within the given range, with a custom accept test, that
		 * returns true if a tileCoordinate is accepted, false otherwise.
		 */
		RandomEmpty( map:TileMap, out TileCoord tile, TileRect range, Func<TileCoord,bool> acceptTest ):boolean {

			int r = UnityEngine.Random.Range( range.minRow, range.maxRow );
			int c = UnityEngine.Random.Range( range.minCol, range.maxCol );

			TileCoord testTile = new TileCoord( r, c );
			if ( acceptTest( testTile ) ) {
				tile = new TileCoord( r, c );
				return true;
			}

			int max = range.getSize();
			int count = 1;

			while ( count < max ) {

				c++;
				if ( c >= range.maxCol ) {
					c = range.minCol;
					r++;
					if ( r >= range.maxRow ) {
						r = range.minRow;
					}
				}

				testTile.row = r;
				testTile.col = c;
				if ( acceptTest( testTile ) ) {
					tile = testTile;
					return true;
				}
				count++;

			} //

			tile = new TileCoord();

			return false;

		} //

		  /**
		   * gets a random available tile from the given range of tiles.
		   */
		static public bool RandomEmpty( layer:TileLayer, out TileCoord tile, TileRect range ) {

			int r = UnityEngine.Random.Range( range.minRow, range.maxRow );
			int c = UnityEngine.Random.Range( range.minCol, range.maxCol );

			if ( layer.IsEmpty( r, c ) ) {
				tile = new TileCoord( r, c );
				return true;
			}

			int max = range.getSize();
			int count = 1;

			while ( count < max ) {

				c++;
				if ( c >= range.maxCol ) {
					c = range.minCol;
					r++;
					if ( r >= range.maxRow ) {
						r = range.minRow;
					}
				}

				if ( layer.IsEmpty( r, c ) ) {
					tile = new TileCoord( r, c );
					return true;
				}
				count++;

			} //

			tile = new TileCoord();

			return false;

		} //

		RandomEmpty( layer:TileLayer, out tile:TileCoord ):boolean {

			int rows = layer.rows;
			int cols = layer.cols;

			int r = UnityEngine.Random.Range( 0, rows );
			int c = UnityEngine.Random.Range( 0, cols );

			if ( layer.isEmpty( r, c ) ) {
				tile = new TileCoord( r, c );
				return true;
			}

			int max = rows * cols;
			int count = 1;

			while ( count < max ) {

				c++;
				if ( c >= cols ) {
					c = 0;
					r++;
					if ( r >= rows ) {
						r = 0;
					}
				}

				if ( layer.isEmpty( r, c ) ) {
					tile = new TileCoord( r, c );
					return true;
				}
				count++;

			} //

			tile = new TileCoord();

			return false;

		} //

		/**
		 * checks the layers from highest to lowest and returns the first random tile found in range
		 * that is empty on all layers.
		*/
		RandomEmpty( map:TileMap ):TileCoord {

			int r = UnityEngine.Random.Range( 0, map.Rows-1 );
			int c = UnityEngine.Random.Range( 0, map.Cols-1 );

			if ( map.IsEmpty( r, c ) ) return TileCoord( r, c );

			int max = map.Rows * map.Cols;
			int count = 1;

			while ( count < max ) {

				c++;
				if ( c >= map.Cols ) {
					c = 0;
					r++;
					if ( r >= map.Rows ) {
						r = 0;
					}
				}

				if ( map.IsEmpty( r, c ) ) return new TileCoord( r, c );
				count++;

			} //

			return null;

		} //
	}