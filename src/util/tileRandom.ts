import {Direction} from '../tileCoord';
import TileRect from '../tileRect';
import TileCoord from '../tileCoord';
import TileMap from '../tileMap';
import TileLayer from '../tileLayer';

export default {

	/**
	 * Returns a random integer between low and high inclusive.
	 */
	range( low, high ) {
		return low + Math.floor( Math.random()*(high+1-low) );
	},

		getTurn( dir:Direction ):number {

			return ( dir === Direction.DOWN || dir === Direction.UP ) ? (

				Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT

			) : (
				Math.random() < 0.5 ? Direction.UP : Direction.DOWN
			);

		},

		Direction():number {

			let val:number = Math.random();
			if ( val < 0.25 ) {
				return Direction.UP;
			} else if ( val < 0.5 ) {
				return Direction.LEFT;
			} else if ( val < 0.75 ) {
				return Direction.DOWN;
			}
			return Direction.RIGHT;

		},

		/**
		 * checks the layers from highest to lowest and returns the first random tile found in range
		 * that is empty on all layers.
		*/
		RandomEmpty( map:TileMap, rect:TileRect ):TileCoord {

			let r:number = this.range( rect.minRow, rect.maxRow );
			let c:number = this.range( rect.minCol, rect.maxCol );

			if ( map.isEmpty( r, c ) ) {
				return new TileCoord( r, c );
			}

			let max:number = rect.getSize();
			let count:number = 1;

			while ( count < max ) {

				c++;
				if ( c >= rect.maxCol ) {
					c = rect.minCol;
					r++;
					if ( r >= rect.maxRow ) {
						r = rect.minRow;
					}
				}

				if ( map.isEmpty( r, c ) ) {
					return new TileCoord( r, c );
				}
				count++;

			} //

			return null;

		},

		/**
		 * Return a random tile that passes a given test.
		 * @param map 
		 * @param rect 
		 * @param acceptTest 
		 */
		FindEmpty( map:TileMap, rect:TileRect, acceptTest:(TileCoord)=>boolean ):TileCoord {

			// begin at random location.
			let r:number = this.range( rect.minRow, rect.maxRow );
			let c:number = this.range( rect.minCol, rect.maxCol );

			var testTile:TileCoord = new TileCoord( r, c );
			if ( acceptTest( testTile ) === true ) {
				return testTile;
			}

			let max:number = rect.getSize();
			let count:number = 1;

			while ( count < max ) {

				c++;
				if ( c >= rect.maxCol ) {
					c = rect.minCol;
					r++;
					if ( r >= rect.maxRow ) {
						r = rect.minRow;
					}
				}

				testTile.row = r;
				testTile.col = c;
				if ( acceptTest( testTile ) === true ) {
					return testTile;
				}
				count++;

			} //

			return null;

		},

		  /**
		   * returns a random available tile from the given range of tiles.
		   */
		InRange( layer:TileLayer, rect:TileRect ):TileCoord {

			let r:number = this.range( rect.minRow, rect.maxRow );
			let c:number = this.range( rect.minCol, rect.maxCol );

			if ( layer.isEmpty( r, c ) === true ) {
				return new TileCoord( r, c );
			}

			let max:number = rect.getSize();
			let count:number = 1;

			while ( count < max ) {

				c++;
				if ( c >= rect.maxCol ) {
					c = rect.minCol;
					r++;
					if ( r >= rect.maxRow ) {
						r = rect.minRow;
					}
				}

				if ( layer.isEmpty( r, c ) === true) {
					return new TileCoord( r, c );
				}
				count++;

			} //

			return null;

		},

		InLayer( layer:TileLayer ):TileCoord {

			let rows:number = layer.rows;
			let cols:number = layer.cols;

			let r:number = Math.floor( Math.random()*rows );
			let c:number = Math.floor( Math.random()*cols );

			if ( layer.isEmpty( r, c ) === true ) {
				return new TileCoord( r, c );
			}

			let max:number = rows * cols;
			let count:number = 1;

			while ( count < max ) {

				c++;
				if ( c >= cols ) {
					c = 0;
					r++;
					if ( r >= rows ) {
						r = 0;
					}
				}

				if ( layer.isEmpty( r, c ) === true ) {
					return new TileCoord( r, c );
				}
				count++;

			} //

			return null;

		},

		/**
		 * checks the layers from highest to lowest and returns the first random tile found in range
		 * that is empty on all layers.
		*/
		InMap( map:TileMap ):TileCoord {

			let r:number = Math.floor( Math.random()*map.rows );
			let c:number = Math.floor( Math.random()*map.cols );

			if ( map.isEmpty( r, c ) ) return new TileCoord( r, c );

			let max:number = map.rows * map.cols;
			let count:number = 1;

			while ( count < max ) {

				c++;
				if ( c >= map.cols ) {
					c = 0;
					r++;
					if ( r >= map.rows ) {
						r = 0;
					}
				}

				if ( map.isEmpty( r, c ) === true ) return new TileCoord( r, c );
				count++;

			} //

			return null;

		}

	}