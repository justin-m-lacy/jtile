﻿
import MapGenerator from '../mapGenerator';
import TileMap from '../../tileMap';
import TileLayer from '../../tileLayer';
import TileSet from '../../tileSet';
import BorderGenerator from '../border';

	/**
	 * Generates a basic KastleKraze map with a border of water around the edge.
	 */
export default class DefaultGenerator extends MapGenerator {

		public generate( map:TileMap, loader:IAssetLoader ):void {

			super.generate( map, loader );
	
			var baseSet:TileSet = TileSet.DefaultBase;
			var topSet:TileSet = TileSet.DefaulTop;

			// clear tiles.
			var layer:TileLayer = map.getLayer( 0 );
			if ( layer == null ) {
				console.log( "DefaultGenerator Error: Layer 0 is null" );
			} else {
				layer.tileSet = baseSet;
			}

			layer.clear( baseSet.GetTileType("Grass").id );

			layer = map.getLayer( 1 );
			if ( layer == null ) {
				console.log( "DefaultGenerator Error: Layer 1 is null" );
			} else {

				layer.tileSet = topSet;
				layer.clear( 0 );
			}

			// set border tiles.
			var generator:BorderGenerator = new BorderGenerator();

			generator.BorderType = topSet.GetTileType( "CastleWall" ).id;
			generator.generate( map, loader );

			var nature:NatureGenerator = new NatureGenerator();
			nature.generate( map, loader );

		}

	} // class
