import RoomData from './roomData';
import TileMap from '../tileMap';
import Hallway from './hallway';
import TileCoord from '../tileCoord';

export default class HallGenerator {

	rooms: RoomData[];
	private curMap: TileMap;

	public constructor( roomList:RoomData[]) {

		this.rooms = roomList;

	}

	public generate(map: TileMap): void {

		this.curMap = map;

	}

	private connectRooms(room1: RoomData, room2: RoomData): void {

		// look for an overlapping row.
		var start: number = room1.getOverlapRow(room2);
		if (start !== -1) {
			this.buildRowPassage(room1, room2, start);
			return;
		} //

		start = room1.getOverlapCol(room2);
		if (start !== -1) {
			this.buildColPassage(room1, room2, start);
			return;
		} //

		// no overlapping row or col.
		// draw a single-bend passage between the rooms.

		// since they do not overlap in cols, one room must be completely to the left of the other.
		if (room1.maxCol < room2.maxCol) {
			this.connectNonoverlapRooms(room1, room2);
		} else {
			this.connectNonoverlapRooms(room2, room1);
		} //

	} //

	/**
	 * connect two rooms that DO NOT OVERLAP either in rows OR columns.
	 * 
	 * as indicated, the first room must be entirely to the left of the second.
	 */
	private connectNonoverlapRooms(leftRoom: RoomData, rightRoom: RoomData): void {

		var hallStartCol: number = leftRoom.maxCol + 1;
		var hallStartRow: number = leftRoom.minRow + Math.random()*( leftRoom.maxRow - leftRoom.minRow );

		// can end anywhere within the range of columns in the second room.
		var hallEndCol: number = rightRoom.minCol + Math.random()*( rightRoom.maxCol - rightRoom.minCol );

		var hallEndRow: number = rightRoom.minRow - 1;
		if (hallStartRow > hallEndRow) {
			hallEndRow = rightRoom.maxRow + 1;
		}

		var hall: Hallway = new Hallway(leftRoom, rightRoom);

		hall.tiles = this.makeBendPassage(hallStartCol, hallEndCol, hallStartRow, hallEndRow);

	} //

	/**
	 * make a bending passage by first following connecting the columns,
	 * and then turning vertically and connecting the rows.
	 */
	private makeBendPassage( startCol:number, endCol:number, startRow:number, endRow:number): TileCoord[] {

		var c:number;

		var tiles: TileCoord[] = new TileCoord[Math.abs(endCol - startCol) + 1 + Math.abs(endRow - startRow)];
		var index: number = 0;

		// horizontal passage.
		//console.log( "horizontal passage: " + startCol + "->" + endCol );
		for (c = startCol; c <= endCol; c++) {

			tiles[index++] = new TileCoord(startRow, c);
			this.curMap.setTileType(startRow, c, 0);

		} //

		// vertical passage.
		if (endRow > startRow) {

			//console.log( "up passage: " + startRow + "->" + endRow );

			for (var r: number = startRow + 1; r <= endRow; r++) {

				tiles[index++] = new TileCoord(r, endCol);
				this.curMap.setTileType(r, c, 0);

			} //

		} else {

			//console.log( "down passage: " + startRow + "->" + endRow  );

			// passage downwards.
			for (var r: number = startRow - 1; r >= endRow; r--) {

				tiles[index++] = new TileCoord(r, endCol);
				this.curMap.setTileType(r, c, 0);

			} //

		} //

		return tiles;

	} // BendPassage

	/**
	 * builds a passage between two rooms with a constant row-value. (horizontal passage.)
	 * rooms must overlap at the given row.
	 * if the rooms overlap, no passage is built.
	 */
	private buildRowPassage(room1: RoomData, room2: RoomData, row: number):void {

		var startCol: number;
		var maxCol: number;

		if (room1.maxCol + 1 < room2.minCol) {

			startCol = room1.maxCol + 1;
			maxCol = room2.minCol;

		} else if (room2.maxCol + 1 < room1.minCol) {

			startCol = room2.maxCol + 1;
			maxCol = room1.minCol;

		} else return;

		var hall: Hallway = new Hallway(room1, room2);
		var coords: TileCoord[] = hall.tiles = new TileCoord[maxCol - startCol];

		// clear passage.
		for (var c: number = startCol; c < maxCol; c++) {

			coords[c - startCol] = new TileCoord(row, c);
			this.curMap.setTileType(row, c, 0);

		} //

	} //

	/**
	 * builds a vertical passage between the two rooms ( which must overlap at the indicated col. )
	 * if the rooms themselves overlap, no passage is built.
	 */
	private buildColPassage(room1: RoomData, room2: RoomData, col: number): void {

		var startRow: number;
		var maxRow: number;

		if (room1.maxRow + 1 < room2.minRow) {

			startRow = room1.maxRow + 1;
			maxRow = room2.minRow;

		} else if (room2.maxRow + 1 < room1.minRow) {

			startRow = room2.maxRow + 1;
			maxRow = room1.minRow;

		} else {
			return;
		}

		var hall: Hallway = new Hallway(room1, room2);
		var coords: TileCoord[] = hall.tiles = new TileCoord[maxRow - startRow];

		// clear passage.
		for (var r: number = startRow; r < maxRow; r++) {
			coords[r - startRow] = new TileCoord(r, col);
			this.curMap.setTileType(r, col, 0);
		} //

	} //

} // class
