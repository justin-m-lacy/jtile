
import {ITileTypeChoice} from './generators/tileTypeChoice';

	enum TileFlags {
		None=0,
		Ground=1,
		Liquid=2,
		Solid=4,
		CoverLower=8,
		Reserved=16
	}

	export { TileFlags}

	export default class TileType implements ITileTypeChoice {

		public id:number;

		public name:string;

		/// <summary>
		/// Special properties of the tile type.
		/// </summary>
		public flags:TileFlags;

		/**
		 * tile causes the player to get hit.
		 * TODO: replace entirely with flags.
		 */
		public solid:boolean;

		/**
			if true, this tile covers any tiles from layers beneath it.
			For example, a bridge tile type can cover a water tile from a lower layer,
			and the player will hit the bridge, not the water.
		**/

		/**
		 * Notes: Ideally a tile hit with a hit rect would automatically cover lower tiles,
		 * but can think of cases where this wouldn't be true. Like hitting a tree
		 * triggering a chirping sound, but still on some blighted tile.. so the tile underneath
		 * still has its effect.
		 * A bridge, if within the hit rect, covers the lower tile so the water tile underneath won't trigger.
		 */
		public coverLowerLayers:boolean = false;

		/// <summary>
		/// Reserved tileTypes are used internally and should not appear in editors,
		/// or be drawn to the map.
		/// </summary>
		public Reserved:boolean = false;

		/// <summary>
		/// Name of the texture image to be drawn to the tile, if any.
		/// </summary>
		public tileTexture:string;

		/// <summary>
		/// Indicates that the hittable area of a tile is defined by the tileType's HitRect.
		/// false by default.
		/// </summary>
		public UseHitRect:boolean = false;

		/**
			if a tile is flat, it appears below other objects (z=0 on the mesh) regardless of its y-position.
		**/
		public isFlat:boolean;

		/**
		 * TODO: possible? unify flat and floating tileType options into single integer.
		 */
		public depth:number;

		/// <summary>
		/// A hittable rect defined in coordinates normalized within the tile (0,0) to (1,1)
		/// Coordinates increase from bottom-left, to top-right.
		/// The HitRect is ignored unless UseHitRect is set to true.
		/// </summary>
		public HitRect:Object;

		constructor( type_id:number, typeName:string, solid:boolean=false ) {

			this.id = type_id;

			this.name = typeName;
			this.solid = solid;

		}

		public getTileType():TileType {
			return this;
		}

	} // class

