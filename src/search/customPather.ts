import TileCoord from '../tileCoord';
import TileMap from '../tileMap';
import { TilePathNode } from './tilePather';
import Heap from '../types/heap';

/**
* Like the basic TilePather, but allows for a custom function for the distance between tiles.
*/
export default class CustomPather {

	/**
	* No real need for this, but could rule out tiles that contain objects/enemies.
	*/
	public AcceptTest:(TileCoord)=>boolean;

	/**
	 * Heuristic distance function which should be accurate for direct links.
	*/
	public DistFunc:(a:TileCoord,b:TileCoord)=>number;

		private _map:TileMap;
		public get map():TileMap {
			return this._map;
		}

		/**
		 * Fringe of potential path nodes.
		 * Key is the estimated (heuristic) distance of a path to the goal using the keyed node.
		 */
		private Fringe:Heap<TilePathNode>;

		/**
			tracks current search_id so the visited array doesn't have to be cleared with every search.
			smaller search ids than the current indicates the tile wasn't visited in the current search.
		**/
		private search_id:number;

		// marks visited tiles with search_id
		private visited:number[][];

		private destCoord:TileCoord;

		public constructor( searchMap:TileMap, distFunc:(a:TileCoord,b:TileCoord)=>number=null,
		acceptTest:(TileCoord)=>boolean=null ) {

			this._map = searchMap;

			this.Fringe = new Heap<TilePathNode>( searchMap.rows * searchMap.cols );

			this.visited = new number[map.rows, map.cols];

			if ( !acceptTest ) {
				this.AcceptTest = this.DefaultAccept;
			} else {
				this.AcceptTest = acceptTest;
			}
			if ( distFunc == null ) {
				this.DistFunc = this.DefaultDist;
			} else {
				this.DistFunc = distFunc;
			}

		} //

		/**
		 * Find the next tile on a path from start to end, without getting the path itself.
		 */
		public FindNext( start:TileCoord, end:TileCoord ):TileCoord {

			this.search_id++;
			this.Fringe.push( 0, new TilePathNode( null, 0, start ) );

			let lastNode:TilePathNode = this.FringeSearch( end );
			if ( lastNode.previous == null ) {
				return start;
			}

			while ( lastNode.previous.coord != start ) {
				lastNode = lastNode.previous;
			}

			return lastNode.coord;

		} //

		/**
			Find a path using a pre-allocated array to hold the path coordinates.
			The new path length is returned.
			if the given path array is not large enough to hold the path, the path is truncated.

		**/
		public FindPathAlloc( start:TileCoord, end:TileCoord, path:TileCoord[] ):number {

			this.search_id++;
			this.Fringe.push( 0, new TilePathNode( null, 0, start ) );

			let lastNode:TilePathNode = this.FringeSearch( end );

			// count the elements in the path
			// the START node is not counted because it's not part of the path.
			let prev:TilePathNode = lastNode.previous;
			let pathLength:number= 0;
			while ( prev ) {
				prev = prev.previous;
				pathLength++;
			}

			// truncate extra path nodes that won't fit in the array.
			while ( pathLength > path.length ) {
				lastNode = lastNode.previous;
				pathLength--;
			} //

			for ( let i:number = pathLength - 1; i >= 0; i-- ) {

				path[i] = lastNode.coord;
				lastNode = lastNode.previous;

			} //

			return pathLength;

		}

		/**
		 * Finds a path which begins with the given forward motion, and does not begin with a backwards movement.
		 * dirCol,dirRow should be one of the cardinal directions, with size 1.
		 */
		public FacingPath( start:TileCoord, end:TileCoord, dirRow:number, dirCol:number):TileCoord[] {

			if ( dirRow === 0 && dirCol === 0 ) {
				return this.FindPath( start, end );
			}

			this.search_id++;

			let node:TilePathNode = new TilePathNode( null, 0, start );
			// TODO: currently can't loop around using the start node.
			// start node is marked as visited, but is not placed in fringe.
			this.visited[start.row][start.col] = this.search_id;

			// Forward:
			this.QueueTile( node, new TileCoord( start.row + dirRow, start.col + dirCol ) );
			// Orthogonals:
			this.QueueTile( node, new TileCoord( start.row + dirCol, start.col + dirRow ) );
			this.QueueTile( node, new TileCoord( start.row - dirCol, start.col - dirRow ) );

			// get final node and work backwards.
			if ( this.Fringe.isEmpty() === false ) {
				node = this.FringeSearch( end );
			}
			return this.BuildPath( node );

		}

		public FindPath( start:TileCoord, end:TileCoord ):TileCoord[] {

			this.search_id++;
			this.Fringe.push( 0, new TilePathNode( null, 0, start ) );

			let lastNode:TilePathNode = this.FringeSearch( end );

			return this.BuildPath( lastNode );

		} //

		/**
		 * Build a path from the lastNode in a search, and return it.
		 */
		private BuildPath( lastNode:TilePathNode ):TileCoord[] {

			// count the elements in the path
			// the START node is not counted because it's not part of the path.
			let prev:TilePathNode = lastNode.previous;
			let pathLength:number= 0;
			while ( prev != null ) {
				prev = prev.previous;
				pathLength++;
			}

			let path:TileCoord[] = new TileCoord[pathLength];
			for ( let i:number= pathLength - 1; i >= 0; i-- ) {

				path[i] = lastNode.coord;
				lastNode = lastNode.previous;

			} //

			return path;

		}

		/**
		 * continue to search for a path in the fringe until the destination is reached,
		 * or the fringe is empty.
		 * TODO: max search depth?
		 * TODO: fringe must have at least one node.
		 */
		protected FringeSearch( end:TileCoord ):TilePathNode {

			this.destCoord = end;
			let next:TilePathNode;

			do {

				next = this.Fringe.pop();
				if ( next.coord == end ) {

					this.Fringe.clear();         // clear up any memory from other nodes.
					break;

				} //

				this.QueueNeighbors( next );

			} while ( this.Fringe.isEmpty() === false );

			return next;

		} //

		/**
		 * Attempts to queue a tile for path search, if not yet searched, not blocked, not off-map.
		 */
		protected QueueTile( prev:TilePathNode, coord:TileCoord ):void {

			if ( coord.row < 0 || coord.row >= this.map.rows || coord.col < 0 || coord.col >= this.map.cols ) {
				return;
			}
			if ( this.visited[coord.row][coord.col] !== this.search_id && this.AcceptTest( coord ) === true ) {

				this.visited[coord.row][coord.col] = this.search_id;
				let node:TilePathNode = new TilePathNode( prev, this.DistFunc( prev.coord, coord ), coord );
				this.Fringe.push( node.distance + this.DistFunc( coord, this.destCoord ), node );

			}

		}

		protected QueueNeighbors( prev:TilePathNode ):void {

			let coord:TileCoord = prev.coord;
			let nextCoord:TileCoord = coord;
			let nextNode:TilePathNode;

			if ( coord.row > 0 ) {

				nextCoord.col = coord.col;
				nextCoord.row = coord.row - 1;

				if ( this.visited[nextCoord.row][nextCoord.col] !== this.search_id ) {

					// check if tile is blocked?
					if ( this.AcceptTest( nextCoord ) === true ) {

						this.visited[nextCoord.row][nextCoord.col] = this.search_id;
						nextNode = new TilePathNode( prev, prev.distance + this.DistFunc(prev.coord, nextCoord), nextCoord );
						this.Fringe.push( nextNode.distance + this.DistFunc( nextCoord, this.destCoord ), nextNode );

					} //

				}

			}

			if ( coord.row + 1 < this.map.rows ) {

				nextCoord.row = coord.row + 1;
				if ( this.visited[nextCoord.row][nextCoord.col] !== this.search_id ) {

					// check if tile is blocked?
					if ( this.AcceptTest( nextCoord ) === true ) {
						this.visited[nextCoord.row][nextCoord.col] = this.search_id;
						nextNode = new TilePathNode( prev, prev.distance + this.DistFunc( prev.coord, nextCoord ), nextCoord );
						this.Fringe.push( nextNode.distance + this.DistFunc( nextCoord, this.destCoord ), nextNode );
					} //

				}

			} //

			// reset row.
			nextCoord.row = coord.row;

			if ( coord.col > 0 ) {

				nextCoord.col = coord.col - 1;
				if ( this.visited[nextCoord.row][nextCoord.col] !== this.search_id ) {

					// check if tile is blocked?
					if ( this.AcceptTest( nextCoord ) === true ) {
						this.visited[nextCoord.row][nextCoord.col] = this.search_id;
						nextNode = new TilePathNode( prev, prev.distance + this.DistFunc( prev.coord, nextCoord ), nextCoord );
						this.Fringe.push( nextNode.distance + this.DistFunc( nextCoord, this.destCoord ), nextNode );
					} //

				}

			} //

			if ( coord.col + 1 < this.map.cols ) {

				nextCoord.col = coord.col + 1;
				if ( this.visited[nextCoord.row][nextCoord.col] !== this.search_id ) {

					// check if tile is blocked?
					if ( this.AcceptTest( nextCoord ) === true ) {
						this.visited[nextCoord.row][nextCoord.col] = this.search_id;
						nextNode = new TilePathNode( prev, prev.distance + this.DistFunc( prev.coord, nextCoord ), nextCoord );
						this.Fringe.push( nextNode.distance + this.DistFunc( nextCoord, this.destCoord ), nextNode );
					} //

				}

			} //

		} //

		private DefaultAccept( coord:TileCoord ):boolean {
			return true;
		}

		/**
		 * Used if no function is supplied to TileDist()
		 */
		private DefaultDist( t1:TileCoord, t2:TileCoord ):number {
	
			return Math.abs( t1.row - t2.row ) + Math.abs( t1.col - t2.col );

		} //

		  /**
			  Must be called if the TileMap size changes, because the visited tiles have to be updated as well.
		  **/
		public UpdateMapSize():void {
			this.visited = new number[this.map.rows][this.map.cols];
		} //

		/**
			resets the search id to zero. this shouldn't be necessary since c# has no overflow,
			but can be used just in case.
		**/
		public ResetSearch():void {
			this.search_id = 0;
		} //

	}