// Copyright 2002-2014, University of Colorado Boulder

/**
 * Basic model for a push button, including over/down/enabled properties and
 * the derived property "interactionState".  The "interactionState" property
 * is intended to be used by a view that will update its appearance when state
 * changes occur.
 *
 * @author Sam Reid
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Object} options
   * @constructor
   */
  function PushButtonModel( options ) {
    var buttonModel = this;

    options = _.extend( {
      fireOnDown: false,
      listener: null
    }, options );

    PropertySet.call( this, {
      over: false,
      down: false,
      enabled: true
    } );

    this.listeners = [];
    if ( options.listener !== null ) {
      this.listeners.push( options.listener );
    }

    // Create the "interactionState" which is often used to determine how to render the button
    this.addDerivedProperty( 'interactionState', ['over', 'down', 'enabled'], function( over, down, enabled ) {
      return !enabled ? 'disabled' :
             over && !down ? 'over' :
             over && down ? 'pressed' :
             'idle';
    } );

    // If button was pressed and "fire on down" was set, fire the listeners
    this.property( 'down' ).onValue( true, function() {
      if ( options.fireOnDown && buttonModel.enabled ) {
        buttonModel.fire();
      }
    } );

    // If button was released and "fire on down" was not set, fire the listeners
    this.property( 'down' ).onValue( false, function() {
      if ( !options.fireOnDown && buttonModel.over && buttonModel.enabled ) {
        buttonModel.fire();
      }
    } );
  }

  return inherit( PropertySet, PushButtonModel, {
    // Adds a listener. If already a listener, this is a no-op.
    addListener: function( listener ) {
      if ( this.listeners.indexOf( listener ) === -1 ) {
        this.listeners.push( listener );
      }
    },

    // Remove a listener. If not a listener, this is a no-op.
    removeListener: function( listener ) {
      var i = this.listeners.indexOf( listener );
      if ( i !== -1 ) {
        this.listeners.splice( i, 1 );
      }
    },

    // Fires all listeners.  Should not be called outside of this file with
    // the possible exception of hooking up for accessibility.
    fire: function() {
      var copy = this.listeners.slice( 0 );
      copy.forEach( function( listener ) {
        listener();
      } );
    }
  } );
} );