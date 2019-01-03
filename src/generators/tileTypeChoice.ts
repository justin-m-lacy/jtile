import TileSet from '../tileSet';
import TileType from '../tileType';

	/**
	 * a tile type choice which can limit the returned tileType according to tileSet.
	 */
export interface ITypeBySet {
	getTileType( tset:TileSet ):TileType;
}

export interface ITileTypeChoice {
	getTileType():TileType;
}

/**
* Provides random tile types organized by tile set.
*/
	class TypeBySet implements ITypeBySet, Iterable<TileType> {

		private typeLists:Map<TileSet, TileType[]>;

		constructor() {

			this.typeLists = new Map<TileSet, TileType[]>();

		}

		public addSetTypes( set:TileSet, types:Iterable<TileType> ):void {

			let typeList:TileType[] = this.typeLists.get(set);

			if ( !typeList ) {
				typeList = new TileType[0];
				this.typeLists.set( set, typeList );

			}
			for( let t of types ) typeList.push( t );

		}

		public *[Symbol.iterator]():Iterator<TileType> {

			for ( var typeList of this.typeLists.values() ) {

				for ( var i:number = typeList.length - 1; i >= 0; i-- ) {
					yield typeList[i];
				}

			}

		}

		public getTileType( tset:TileSet ):TileType {

			var typeGroup:TileType[] = this.typeLists.get(tset);

			if ( typeGroup ) {

				if ( typeGroup.length <= 0 ) return null;

				return typeGroup[ Math.floor( Math.random()*typeGroup.length ) ];

			}
			return null;

		}

	}

	/**
	 * List of tileTypes with equal probability of any being returned.
	 */
	class TileTypeList extends Array<TileType> implements ITileTypeChoice {

		public getTileType():TileType {
			return this[ Math.floor( Math.random()*this.length )];
		}

	}

	/**
	 * Defines a list of tile types, with the percent chance
	 * of each tile type being selected.
	 */
	class TileTypeChoice implements ITileTypeChoice, Iterable<TileType> {

		private tileTypes:TileType[];

		/**
		 * Each percent must be positive and the sum must be 1.
		 */
		private rates:number[];

		/**
		 * If no percents are specified, all tileTypes will have equal chances of
		 * being chosen.
		 */
		public constructor( types:TileType[], percents:number[] = null ) {

			this.tileTypes = types;

			if ( percents == null ) this.CreateEqualRates();
			else this.rates = percents;


		}

		*[Symbol.iterator]():Iterator<TileType> {
			return this.tileTypes[Symbol.iterator]();
		}

		/**
		 * Returns a random TileType according to the probabilities
		 * assigned to each type.
		 */
		public getTileType():TileType {

			if ( !this.tileTypes ) {
				console.log( "TileTypeChoice.GetRandType(): No tileTypes" );
				return null;
			}

			var len:number = this.tileTypes.length;
			if ( len === 0 ) {
				console.log( "TileTypeChoice.GetRandType(): Len 0 tileTypes" );
				return null;
			}

			var v:number = Math.random();
			var pct:number;
			for ( var i:number = len - 1; i >= 0; i-- ) {

				pct = this.rates[i];
				if ( pct < v ) {
					return this.tileTypes[i];
				}
				v -= pct;

			}
			return null;

		}

		/**
		 * Assign equal probabilities to each tile type.
		 */
		private CreateEqualRates():void {

			if ( this.tileTypes == null ) {
				console.log( "TileTypeChoice.CreateEqualRates(): No tileTypes" );
				return;
			}

			var len:number = this.tileTypes.length;
			if ( len === 0 ) {
				console.log( "TileTypeChoice.CreateEqualRates(): Len 0 tileTypes" );
				return;
			}

			this.rates = new Array<number>( len );
			var rate:number = (1 / len);

			for ( var i:number = 0; i < len; i++ ) {
				this.rates[i] = rate;
			}

		}

	}