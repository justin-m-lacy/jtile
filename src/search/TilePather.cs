
	public class TilePathNode {

		// total distance to get to this location. (real, not estimated)
		public float distance;

		public TilePathNode previous;
		public TileCoord coord;

		public TilePathNode( TilePathNode prev, float dist, TileCoord tile ) {
			this.distance = dist;
			this.previous = prev;
			this.coord = tile;
		} //

	} //

	public class TilePather {

		public Predicate<TileCoord> AcceptTest;

		private TileMap map;
		public TileMap Map {
			// TODO: have to update visited[rows,cols]
			/*set {
				this.map = value;
			}*/
			get {
				return map;
			}
		}
	
		/**
		 * Fringe of potential path nodes.
		 * Key is the estimated (heuristic) distance of a path to the goal using the keyed node.
		 */
		private Heap<TilePathNode> Fringe;

		/**
			tracks current search_id so the visited array doesn't have to be cleared with every search.
			smaller search ids than the current indicates the tile wasn't visited in the current search.
		**/
		private int search_id;

		// marks visited tiles with search_id
		private int[,] visited;

		private TileCoord destCoord;

		public TilePather( TileMap searchMap ) {

			this.map = searchMap;

			this.Fringe = new Heap<TilePathNode>( map.Rows * map.Cols );

			this.visited = new int[map.Rows, map.Cols];

			this.AcceptTest = ApproveTile;

		} //

		/**
		 * default blocked-tile test if none supplied: all tiles assumed unblocked.
		 */
		protected bool ApproveTile( TileCoord coord ) {
			return true;
		}

		/**
		 * Find the next tile on a path from start to end, without getting the path itself.
		 */
		public TileCoord FindNext( TileCoord start, TileCoord end ) {

			this.search_id++;
			this.Fringe.Push( 0, new TilePathNode( null, 0, start ) );

			TilePathNode lastNode = FringeSearch( end );
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
		public int FindPathAlloc( TileCoord start, TileCoord end, TileCoord[] path ) {

			this.search_id++;
			this.Fringe.Push( 0, new TilePathNode( null, 0, start ) );

			TilePathNode lastNode = FringeSearch( end );

			// count the elements in the path
			// the START node is not counted because it's not part of the path.
			TilePathNode prev = lastNode.previous;
			int pathLength = 0;
			while ( prev != null ) {
				prev = prev.previous;
				pathLength++;
			}

			// truncate extra path nodes that won't fit in the array.
			while ( pathLength > path.Length ) {
				lastNode = lastNode.previous;
				pathLength--;
			} //

			for ( int i = pathLength - 1; i >= 0; i-- ) {

				path[i] = lastNode.coord;
				lastNode = lastNode.previous;

			} //

			return pathLength;

		}

		/**
		 * Finds a path which begins with the given forward motion, and does not begin with a backwards movement.
		 * dirCol,dirRow should be one of the cardinal directions, with size 1.
		 */
		public TileCoord[] FindPath( TileCoord start, TileCoord end, int dirRow, int dirCol ) {

			if ( dirRow == 0 && dirCol == 0 ) {
				return FindPath( start, end );
			}

			this.search_id++;

			TilePathNode node = new TilePathNode( null, 0, start );
			// TODO: currently can't loop around using the start node.
			// start node is marked as visited, but is not placed in fringe.
			visited[start.row, start.col] = search_id;

			// Forward:
			QueueTile( node, new TileCoord( start.row + dirRow, start.col + dirCol ) );
			// Orthogonals:
			QueueTile( node, new TileCoord( start.row + dirCol, start.col + dirRow ) );
			QueueTile( node, new TileCoord( start.row - dirCol, start.col - dirRow ) );

			// get final node and work backwards.
			if ( !Fringe.IsEmpty() ) {
				node = FringeSearch( end );
			}

			return BuildPath( node );

		}

		public TileCoord[] FindPath( TileCoord start, TileCoord end ) {

			this.search_id++;
			this.Fringe.Push( 0, new TilePathNode( null, 0, start ) );

			TilePathNode lastNode = FringeSearch( end );

			return BuildPath( lastNode );


		} //

		/**
		 * Build a path from the lastNode in a search, and return it.
		 */
		private TileCoord[] BuildPath( TilePathNode lastNode ) {

			// count the elements in the path
			// the START node is not counted because it's not part of the path.
			TilePathNode prev = lastNode.previous;
			int pathLength = 0;
			while ( prev != null ) {
				prev = prev.previous;
				pathLength++;
			}

			TileCoord[] path = new TileCoord[pathLength];
			for ( int i = pathLength - 1; i >= 0; i-- ) {

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
		protected TilePathNode FringeSearch( TileCoord end ) {

			this.destCoord = end;
			TilePathNode next;

			do {

				next = Fringe.PopMin();
				if ( next.coord == end ) {

					Fringe.Clear();         // clear up any memory from other nodes.
					break;

				} //

				QueueNeighbors( next );

			} while ( !Fringe.IsEmpty() );

			return next;

		} //

		/**
		 * Attempts to queue a tile for path search, if not yet searched, not blocked, not off-map.
		 */
		protected void QueueTile( TilePathNode prev, TileCoord coord ) {

			if ( coord.row < 0 || coord.row >= map.Rows || coord.col < 0 || coord.col >= map.Cols ) {
				return;
			}
			if ( visited[coord.row, coord.col] != search_id && AcceptTest(coord) ) {

				visited[coord.row, coord.col] = search_id;
				TilePathNode node = new TilePathNode( prev, prev.distance + 1, coord );
				Fringe.Push( node.distance + TileDistance( coord, destCoord ), node );

			}

		}

		protected void QueueNeighbors( TilePathNode prev ) {

			TileCoord coord = prev.coord;
			TileCoord nextCoord = coord;
			TilePathNode nextNode;

			if ( coord.row > 0 ) {

				nextCoord.col = coord.col;
				nextCoord.row = coord.row - 1;

				if ( visited[nextCoord.row, nextCoord.col] != search_id ) {

					// check if tile is blocked?
					if ( AcceptTest( nextCoord ) ) {

						visited[nextCoord.row, nextCoord.col] = search_id;
						nextNode = new TilePathNode( prev, prev.distance + 1, nextCoord );
						Fringe.Push( nextNode.distance + TileDistance( nextCoord, destCoord ), nextNode );

					} //

				}

			}

			if ( coord.row+1 < this.map.Rows ) {

				nextCoord.row = coord.row + 1;
				if ( visited[nextCoord.row, nextCoord.col] != search_id ) {

					// check if tile is blocked?
					if ( AcceptTest( nextCoord ) ) {
						visited[nextCoord.row, nextCoord.col] = search_id;
						nextNode = new TilePathNode( prev, prev.distance + 1, nextCoord );
						Fringe.Push( nextNode.distance + TileDistance( nextCoord, destCoord ), nextNode );
					} //

				}

			} //

			// reset row.
			nextCoord.row = coord.row;

			if ( coord.col > 0 ) {

				nextCoord.col = coord.col - 1;
				if ( visited[nextCoord.row, nextCoord.col] != search_id ) {

					// check if tile is blocked?
					if ( AcceptTest( nextCoord ) ) {
						visited[nextCoord.row, nextCoord.col] = search_id;
						nextNode = new TilePathNode( prev, prev.distance + 1, nextCoord );
						Fringe.Push( nextNode.distance + TileDistance( nextCoord, destCoord ), nextNode );
					} //

				}

			} //

			if ( coord.col+1 < this.map.Cols ) {

				nextCoord.col = coord.col + 1;
				if ( visited[nextCoord.row, nextCoord.col] != search_id ) {

					// check if tile is blocked?
					if ( AcceptTest( nextCoord ) ) {
						visited[nextCoord.row, nextCoord.col] = search_id;
						nextNode = new TilePathNode( prev, prev.distance + 1, nextCoord );
						Fringe.Push( nextNode.distance + TileDistance( nextCoord, destCoord ), nextNode );
					} //

				}

			} //

		} //

		public float TileDistance( TileCoord t1, TileCoord t2 ) {

			return Mathf.Abs( t1.row - t2.row ) + Mathf.Abs( t1.col - t2.col );

		} //

		/**
			Must be called if the TileMap size changes, because the visited tiles have to be updated as well.
		**/
		public void UpdateMapSize() {
			this.visited = new int[map.Rows, map.Cols];
		} //

		/**
			resets the search id to zero. this shouldn't be necessary since c# has no overflow,
			but can be used just in case.
		**/
		public void ResetSearch() {
			this.search_id = 0;
		} //

	}