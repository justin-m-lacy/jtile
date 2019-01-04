import TileMap from "../tileMap";
import TileLayer from "../tileLayer";
import TileSet from "../tileSet";
import Tile from "../tile";

/**
 * {number} Encoding bytes per tile in the current implementation.
 */
export const TILE_ENCODE_BYTES:number = 5;

export function mapToJSON():string {
	return '';
}


export function encodeMap( map:TileMap ):string {

	let count:number= map.layerCount;
	let json:any = {};

	let layer:TileLayer;

	json.rows = map.rows;
	json.cols = map.cols;

	let layers:object[] = [];
	let layerData:any, set:TileSet;

	for( let i:number= 0; i < count; i++ ) {

		layer = map.getLayer( i );		
		layerData = {};

		layerData.rows = layer.rows;
		layerData.cols = layer.cols;

		layerData.tilesize = TILE_ENCODE_BYTES;

		set = layer.tileSet;
		if ( set && set.name ) {
			layerData.tileset = set.name;
		}

		layerData.tiles = encodeLayerTiles( layer );
		layers.push( layerData );

	} //

	json.layers = layers;

	return JSON.stringify( json );

}

export function encodeLayerTiles( layer:TileLayer, buffer?:Uint8Array ):string {

	let tile:Tile;

	let rows:number= layer.rows;
	let cols:number= layer.cols;

	buffer = buffer || new Uint8Array( rows*cols*TILE_ENCODE_BYTES );

	let index:number = 0;

	for( var r:number=0; r < rows; r++ ) {
					
		for( var c:number =0; c < cols; c++ ) {

			index = write32( buffer, tile.tileTypeId, index );
			buffer[index++] = tile.orientation;
						
		} // for-loop.
					
	} // for-loop.

	return btoa( new TextDecoder( 'utf8' ).decode( buffer ) );

}

export function decodeMap( json:string ):TileMap {

	let obj:any = JSON.parse( json );

	let layersData:any = obj.layers;
	let rows:number = obj.rows;
	let cols:number = obj.cols;

	let map = new TileMap( layersData.length, rows, cols );

	let layerData, layer;
	for( let i = 0; i < layersData.length; i++ ) {

		layer = map.getLayer( i );
		layerData = layersData[i];

		decodeLayerTiles( layer, layerData.tiles, TILE_ENCODE_BYTES );

	}

	return map;

}

/**
 * 
 * @param {TileLayer} layer - tiles will be read into this layer's tiles.
 * @param {string} tileData base64 encoded tile data.
 * @param {number} tileBytes - encoded bytes per tile.
 */
export function decodeLayerTiles( layer:TileLayer, tileData:string, tileBytes:number=TILE_ENCODE_BYTES ):void {

	let tiles = layer.getTiles();
	let tileRow:Tile[];

	let tile:Tile;
	let index = 0, rows:number = layer.rows, cols:number = layer.cols;

	let buffer:Uint8Array = ( new TextEncoder().encode( atob( tileData ) ) );

	if ( buffer.length !== (rows*cols*tileBytes) )
		throw new Error( 'Unexpected data size: Expected: ' + (rows*cols*tileBytes) + ' got: ' + buffer.length );

	let orient:number, type:number;

	for( let r:number = 0; r < rows; r++ ) {

		tileRow = tiles[r];
		for( var c:number = 0; c <cols; c++ ) {

			type = read32( buffer, index );
			index += 4;
			orient = buffer[index++];

			tile = new Tile( type, orient );
			tileRow[c] = tile;

		}

	}

}

/**
 * Write a 32 bit number to a buffer.
 * @param buffer 
 * @param {number} val - value to write.
 * @param at
 * @returns {number} the next buffer index.
 */
function write32( buffer:Uint8Array, val:number, at:number=0 ):number {

	buffer[at++] = 0xFF&val;
	buffer[at++] = 0xFF&(val>>8);
	buffer[at++] = 0xFF&(val>>16);
	buffer[at++] = 0xFF&(val>>24);

	return at;

}

/**
 * Write a 16 bit number from a buffer.
 * @param buffer
 * @param {number} val - value to write.
 * @param at
 * @returns {number} the next buffer index.
 */
function write16( buffer:Uint8Array, val:number, at:number=0 ):number {

	buffer[at++] = 0xFF&val;
	buffer[at++] = 0xFF&(val>>8);

	return at;

}

function read32( buffer:Uint8Array, at:number=0 ):number {

	let val = buffer[at++];
	val += buffer[at++] << 8;
	val += buffer[at++] << 16;
	val += buffer[at++] << 24;

	return val;

}

function read16( buffer:Uint8Array, at:number=0 ):number {

	let val = buffer[at++];
	val += buffer[at++] << 8;

	return val;

}