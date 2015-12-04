// Copyright 2014-2015, University of Colorado Boulder

/**
 * An interactive round push button.  This is the file in which the appearance and behavior are brought together.
 *
 * This class inherits from RoundButtonView, which contains all of the
 * code that defines the button's appearance, and adds the button's behavior
 * by hooking up a button model.
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PushButtonInteractionStateProperty = require( 'SUN/buttons/PushButtonInteractionStateProperty' );
  var PushButtonModel = require( 'SUN/buttons/PushButtonModel' );
  var RoundButtonView = require( 'SUN/buttons/RoundButtonView' );
  var sun = require( 'SUN/sun' );

  /**
   * @param {Object} [options] - All of the general Scenery node options can be
   * used, see Node.js or the Scenery documentation. In addition, the
   * following options are available. Note that there is no automated process
   * to keep these up to date, so keep that in mind when using these (and
   * please fix any errors you notice!).
   *
   * All of these values have defaults, so only specify them when needed.
   *
   *    baseColor:              The color for the main portion of the button, other colors for highlights and shadows will be based off of this
   *    content:                The node to display on the button, can be null for a blank button
   *    disabledBaseColor:      The color for the main portion of the button when disabled, other colors for highlights and shadows will be based of of this
   *    fireOnDown:             Boolean that controls whether the listener function(s) are fired when the button is pressed down instead of when released
   *    listener:               Function that is called when this button is fired
   *    minXMargin:             Minimum margin between the content and the edge in the x (i.e. horizontal) direction
   *    minYMargin:             Minimum margin between the content and the edge in the y (i.e. vertical) direction
   *    radius:                 Radius of the button, not needed unless a fixed radius beyond the size of the content is needed
   *    setContentEnabledLook:  Function that controls how the content appearance changes when the button is disabled
   *    touchExpansion:         Amount added beyond the radius to the touch area
   *    xContentOffset:         Offset from center in the X direction for the content node, sometimes needed for a good visual look
   *    yContentOffset:         Offset from center in the Y direction for the content node, sometimes needed for a good visual look
   *
   * @constructor
   */
  function RoundPushButton( options ) {

    options = _.extend( { tandem: null }, options );

    // Safe to pass through options to the PushButtonModel like "fireOnDown".  Other scenery options will be safely ignored.
    this.buttonModel = new PushButtonModel( options ); // @public, listen only
    RoundButtonView.call( this, this.buttonModel, new PushButtonInteractionStateProperty( this.buttonModel ), options );

    // Tandem support
    // Give it a novel name to reduce the risk of parent or child collisions
    this.roundPushButtonTandem = options.tandem;
    this.roundPushButtonTandem && this.roundPushButtonTandem.addInstance( this );
  }

  sun.register( 'RoundPushButton', RoundPushButton );

  return inherit( RoundButtonView, RoundPushButton, {

    // @public
    dispose: function() {
      this.roundPushButtonTandem && this.roundPushButtonTandem.removeInstance( this );
    },

    // @public
    addListener: function( listener ) {
      this.buttonModel.addListener( listener );
    },

    // @public
    removeListener: function( listener ) {
      this.buttonModel.removeListener( listener );
    }
  } );
} );