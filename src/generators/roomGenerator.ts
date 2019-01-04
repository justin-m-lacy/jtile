import RoomData from './roomData';
import TileMap from '../tileMap';
import Random from '../util/tileRandom';

// TODO: only works with filled (non-passable) background which gets cut out.
export default class RoomGenerator {

	public minRoomSize: number;
	public maxRoomSize: number;

	public minRooms: number;
	public maxRooms: number;

	/**
	 * types allowed for generating floor layers.
	 */
	public floorTypes: number[];

	/**
	 * types allowed for generating walls on floor layer.
	 */
	public wallTypes: number[];

	private curMap: TileMap;

	private rooms: RoomData[];

	public RoomGenerator(floors: number[] = null, walls: number[] = null) {

		if (!floors || floors.length === 0) {
			this.floorTypes = new Array<number>(0);

		} else this.floorTypes = floors;


		if (!walls || walls.length === 0) {
			this.wallTypes = new Array<number>(1);
		} else this.wallTypes = walls;



	} //

	public configSizes(min_rooms: number = 10, max_rooms: number = 15, min_size: number = 3, max_size: number = 12): void {

		this.minRooms = min_rooms;
		this.maxRooms = max_rooms;

		this.minRoomSize = min_size;
		this.maxRoomSize = max_size;

	}

	/**
	 * NOTE: might want to replace randoms with perlin
	 */
	public Generate(map: TileMap): void {

		this.curMap = map;

		var room: RoomData;

		var roomCount: number = Random.range(this.minRooms, this.maxRooms);
		this.rooms = new RoomData[roomCount];

		var mapRows: number = map.rows;
		var mapCols: number = map.cols;

		var startRow: number, startCol;
		var roomRows: number, roomCols;

		//console.log( "total rooms: " + roomCount );

		for (var i: number = 0; i < roomCount; i++) {

			// NOTE: start at 1 to ensure no walls are erased at the map border.
			startRow = Random.range(1, mapRows - this.minRoomSize);
			startCol = Random.range(1, mapCols - this.minRoomSize);

			roomRows = Random.range(this.minRoomSize, this.maxRoomSize);
			roomCols = Random.range(this.minRoomSize, this.maxRoomSize);

			room = this.generateRoom(startRow, startCol, startRow + roomRows - 1, startCol + roomCols - 1);
			this.rooms[i] = room;

			//console.log( "room: " + room.GetWidth() + "," + room.GetHeight() );

		} //

		// Connect rooms in sequence.
		for (var i: number = 1; i < roomCount; i++) {

			this.connectRooms(this.rooms[i - 1], this.rooms[i]);

		} //

		//this.curMap.Rooms = this.rooms;

	} //

	/**
	 * generate rooms with the given map coordinates. endRow, endCol are included in
	 * in the room size.
	 */
	private generateRoom(startRow: number, startCol: number, endRow: number, endCol: number): RoomData {

		if (endRow >= this.curMap.rows - 1) {
			endRow = this.curMap.rows - 2;
		}
		if (endCol >= this.curMap.cols - 1) {
			endCol = this.curMap.cols - 2;
		}

		for (var r: number = startRow; r <= endRow; r++) {

			for (var c: number = startCol; c <= endCol; c++) {

				// clear out the room.
				this.curMap.setTileType(r, c, 0);

			} //

		} //

		return new RoomData(this.curMap, startRow, startCol, endRow, endCol);

	} //

	/**
	 * eventually replace with a PassageGenerator
	 */
	private connectRooms(room1: RoomData, room2: RoomData): void {

		// look for an overlapping row.
		var start: number = room1.getOverlapRow(room2);
		if (start !== -1) {
			this.buildRowPassage(room1, room2, start);
			return;
		} //

		start = room1.getOverlapCol(room2);
		if (start != -1) {
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

		var hallStartCol: number = leftRoom.maxCol;
		var hallStartRow: number = Random.range(leftRoom.minRow, leftRoom.maxRow);

		// can end anywhere within the range of columns in the second room.
		var hallEndCol: number = Random.range(rightRoom.minCol, rightRoom.maxCol);

		// assume we're going down to the start row of the right room.
		// however if the row we left from is greater than the start row,
		// we expect to hit the END row first ( since the rooms do not overlap in rows or cols )
		var hallEndRow: number = rightRoom.minRow;
		if (hallStartRow > hallEndRow) {
			hallEndRow = rightRoom.maxRow;
		}

		this.makeBendPassage(hallStartRow, hallStartCol, hallEndRow, hallEndCol);

	} //

	/**
	 * make a bending passage by first following connecting the columns,
	 * and then turning vertically and connecting the rows.
	 */
	private makeBendPassage(startRow: number, startCol: number, endRow: number, endCol: number): void {

		var c: number;

		// horizontal passage.
		//console.log( "horizontal passage: " + startCol + "->" + endCol );
		for (c = startCol; c <= endCol; c++) {
			this.curMap.setTileType(startRow, c, 0);
		} //

		// vertical passage.
		if (endRow > startRow) {

			//console.log( "up passage: " + startRow + "->" + endRow );

			for (var r: number = startRow; r < endRow; r++) {
				this.curMap.setTileType(r, c, 0);
			} //

		} else {

			//console.log( "down passage: " + startRow + "->" + endRow  );

			// passage downwards.
			for (var r: number = startRow; r > endRow; r--) {
				this.curMap.setTileType(r, c, 0);
			} //

		} //

	} //

	/**
	 * builds a row passage between the two rooms ( which must overlap at the indicated row. )
	 * if the rooms themselves overlap, no passage is built.
	 */
	private buildRowPassage(room1: RoomData, room2: RoomData, row: number): void {

		var startCol: number;
		var maxCol: number;

		if (room1.minCol < room2.minCol) {

			startCol = room1.minCol + 1;
			maxCol = room2.minCol;

		} else {

			startCol = room2.minCol + 1;
			maxCol = room1.minCol;

		} //

		// clear passage.
		for (var c: number = startCol; c < maxCol; c++) {
			this.curMap.setTileType(row, c, 0);
		} //

	} //

	/**
	 * builds a col passage between the two rooms ( which must overlap at the indicated col. )
	 * if the rooms themselves overlap, no passage is built.
	 */

	private buildColPassage(room1: RoomData, room2: RoomData, col: number): void {

		var startRow: number;
		var maxRow: number;

		if (room1.minRow < room2.minRow) {

			startRow = room1.minRow + 1;
			maxRow = room2.minRow;

		} else {

			startRow = room2.minRow + 1;
			maxRow = room1.minRow;

		} //

		// clear passage.
		for (var r: number = startRow; r < maxRow; r++) {
			this.curMap.setTileType(r, col, 0);
		} //

	} //

	public getRandomRoom(): RoomData {
		return this.rooms[Math.floor(Math.random() * (this.rooms.length - 1))];
	} //

} // class