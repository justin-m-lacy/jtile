
import TileLayer from '../tileLayer';
import ITileRegion from '../regions/iTileRegion';

	/**
	 * Fills the given region with the given tile types according to given tileType.
	 */
	class FillGenerator {

		private tileTypes:ITileTypeChoice;
		private region:ITileRegion;

		public FillGenerator( typeChoices:ITileTypeChoice, targetRegion:ITileRegion ) {

			this.tileTypes = typeChoices;
			this.region = targetRegion;

		}

		public Generate( layer:TileLayer ):void {

			for ( var coord of this.region ) {
				layer.setTileType( coord.row, coord.col, tileTypes.getTileType() );
			}

		}

	} //

}