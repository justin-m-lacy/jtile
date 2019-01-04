
import TileLayer from '../tileLayer';
import ITileRegion from '../regions/iTileRegion';
import { ITileTypeChoice } from './tileTypeChoice';

/**
 * Fills the given region with the given tile types according to given tileType.
 */
export default class FillGenerator {

	private tileTypes: ITileTypeChoice;
	private region: ITileRegion;

	public FillGenerator( typeChoices: ITileTypeChoice, targetRegion: ITileRegion) {

		this.tileTypes = typeChoices;
		this.region = targetRegion;

	}

	public Generate(layer: TileLayer): void {

		for ( let coord of this.region ) {
			layer.setTileType(coord.row, coord.col, this.tileTypes.getTileType().id);
		}

	}

}