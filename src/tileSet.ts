import TileType from './tileType';

export default class TileSet {

		private static _ActiveSets:Map<string, TileSet>;
		private static _DefaultBase:TileSet;

		public static get DefaultBase():TileSet {
				return TileSet._DefaultBase;
		}

		public static set DefaultBase(v) {
			TileSet._DefaultBase = v;
		}

		private static _DefaultTop:TileSet;
		public static get DefaulTop():TileSet {
				return TileSet._DefaultTop;
			}
		public static set DefaultTop(v) {
			TileSet._DefaultTop = v;
			}
		

		/**
		 * Attempts to get a named tileSet as a base set.
		 * If none is found, the default base set is returned.
		 */
		public static TryGetBase( name:string ):TileSet {

			let tset:TileSet = TileSet.GetSet( name );
			if ( !tset ) {
				tset = TileSet._DefaultBase;
			}
			return tset;

		}
		public static TryGetTop( name:string ):TileSet {

			let tset:TileSet = TileSet.GetSet( name );
			if ( !tset ) {
				tset = TileSet._DefaultBase;
			}
			return tset;

		}

		public static SetDefaults( groundSet:TileSet, topSet:TileSet ):void {

			TileSet._DefaultBase = groundSet;
			if ( groundSet != null && groundSet.name ) {
				TileSet.AddSet( groundSet.name, groundSet );
			}

			TileSet._DefaultTop = topSet;
			if ( topSet != null && topSet.name ) {
				TileSet.AddSet( topSet.name, topSet );
			}

		}

		public static ClearActiveSets():void {
			TileSet._ActiveSets.clear();

		}

		public static AddSet( setName:string, tset:TileSet ):void {

			if ( TileSet._ActiveSets == null ) {
				TileSet._ActiveSets = new Map<string, TileSet>();
			}
			TileSet._ActiveSets[setName] = tset;

		}

		public static GetSet( setName:string ):TileSet {

			if ( TileSet._ActiveSets == null ) {
				return null;
			}
			return TileSet._ActiveSets[setName];

		}

		public name:string = "default";

		/**
		 * Source of the tile set.
		 */
		public sourceDir:string;

		public TileSet( setName:string=null ) {
			this.name = setName;
		}


		protected _tileTypes:TileType[];
		public get tileTypes():TileType[] {
				return this._tileTypes;
			}
		
		public set tileTypes(value) {
				this._tileTypes = value;
			}

		public get size():number {
				return this._tileTypes.length;
			}

		public getTileType( id:number|string):TileType {
			
			return this._tileTypes[ id ];
			
		} //

		public setTileTypes( newTypes:TileType[] ):void {
			this._tileTypes = newTypes;

		} //

		*[Symbol.iterator]():Iterator<TileType> {

			let len = this._tileTypes.length;
			for( let i = 0; i < len; i++ ) yield this._tileTypes[i];

		}

	} // class