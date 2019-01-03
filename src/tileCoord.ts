export default class TileCoord {

	public static OFF_MAP:number = Number.MIN_VALUE;

	public row:number;
	public col:number;

	constructor( r:number=0, c:number=0 ) {

		this.row = r;
		this.col = c;
	}

	public setLocation( r:number=0, c:number=0 ):void {
		this.row = r;
		this.col = c;
	}

	public isOffMap():boolean {
		return ( this.row === TileCoord.OFF_MAP || this.col === TileCoord.OFF_MAP );
	}

	public equals( coord:TileCoord ):boolean {

		return coord.row === this.row && coord.col === this.col;

	}

	public toString():string {
		return ( this.row + "," + this.col );
	}

	public pickTile():TileCoord {
		return this;
	}

	public has( coord:TileCoord ):boolean {
		return ( coord.row === this.row && coord.col === this.col );
	}

	public contains( row:number, col:number ):boolean {
		return ( row === this.row && col === this.col );
	}

	public getSize():number {
		return 1;
	}

} // END TileCoord