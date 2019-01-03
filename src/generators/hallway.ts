
import RoomData from './RoomData';
import TileCoord from '../tileCoord';

/**
 * a hallway is a series of tiles on the map that links two rooms together.
 */
export default class Hallway {

	/**
	 * Final coordinates of the hallway. These are outside the rooms they link.
	 */
	//public TileCoord exit1, exit2;

	/**
	 * rooms linked.
	 */
	public room1: RoomData;
	public room2: RoomData;

	// TODO: might just use the end tile coordinates and path-find to get in-between tiles.
	/**
	 * tiles which are part of the hallway. the hall might be crossed by other halls.
	 */
	public tiles: TileCoord[];

	/**
	 * Create new link between two rooms.
	 */
	public constructor(r1: RoomData, r2: RoomData) {

		this.room1 = r1;
		this.room2 = r2;

		r1.addExit(this);
		r2.addExit(this);

	}


} // class