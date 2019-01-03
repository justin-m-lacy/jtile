
import TileMap from '../tileMap';
import Tile from '../tile';
import BaseGenerator from './primary/baseGenerator';

	/**
	 * places water all around the bottom/side edges of a map, and sets the top
	 * to a castle type.
	 * 
	 * NOTE: in unity 2d, y goes from the bottom of the screen up, and so row 0 is at the bottom, maxRow is at the top.
	 */
export default class BorderGenerator extends BaseGenerator {

		// id of the castle wall tileType
		public BorderType:number;

		public generate( map:TileMap ):void {

			var tiles:Tile[][] = map.getLayer(0).getTiles();
			var rows:number = map.rows;
			var cols:number = map.cols;

			// fill sides with water.
			var maxCol:number = cols-1;
			var maxRow:number = rows-1;
			for( var r:number = 1; r <= maxRow; r++ ) {

				tiles[r][0].tileTypeId = tiles[r][maxCol].tileTypeId = this.BorderType;

			} //

			// bottom water.
			for( var c:number = 0; c < cols; c++ ) {
				tiles[0][c].tileTypeId = this.BorderType;
			} //

			// top castle wall.
			tiles = map.getLayer( 1 ).getTiles();
			for( var c:number = 1; c < maxCol; c++ ) {
				tiles[maxRow][c].tileTypeId = this.BorderType;
			} //

		} // Generate()

	} // class