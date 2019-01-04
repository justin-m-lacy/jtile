
import MapGenerator from '../mapGenerator';
import TileMap from '../../tileMap';
import TileLayer from '../../tileLayer';
import TileSet from '../../tileSet';
import BorderGenerator from '../border';
import NatureGenerator from '../natureGenerator';

	/**
	 * Generates a basic KastleKraze map with a border of water around the edge.
	 */
export default class DefaultGenerator extends MapGenerator {

		public generate( map:TileMap ):void {

			super.generate( map );
	
			var baseSet:TileSet = TileSet.DefaultBase;
			var topSet:TileSet = TileSet.DefaulTop;

			// clear tiles.
			var layer:TileLayer = map.getLayer( 0 );
			if ( layer == null ) {
				console.log( "DefaultGenerator Error: Layer 0 is null" );
			} else {
				layer.tileSet = baseSet;
			}

			layer.clear( baseSet.getTileType("Grass").id );

			layer = map.getLayer( 1 );
			if ( layer == null ) {
				console.log( "DefaultGenerator Error: Layer 1 is null" );
			} else {

				layer.tileSet = topSet;
				layer.clear( 0 );
			}

			// set border tiles.
			var generator:BorderGenerator = new BorderGenerator();

			generator.BorderType = topSet.getTileType( "CastleWall" ).id;
			generator.generate( map );

			var nature:NatureGenerator = new NatureGenerator();
			nature.generate( map );

		}

	} // class

