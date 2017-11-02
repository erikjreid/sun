// Copyright 2013-2017, University of Colorado Boulder

/**
 * Base class for radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var phetioEvents = require( 'ifphetio!PHET_IO/phetioEvents' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sun = require( 'SUN/sun' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TRadioButton = require( 'SUN/TRadioButton' );

  /**
   * @param {Property} property
   * @param {*} value the value that corresponds to this button, same type as property
   * @param {Node} selectedNode node that will be displayed when the button is selected
   * @param {Node} deselectedNode node that will be displayed when the button is deselected
   * @param {Object} [options]
   * @constructor
   */
  function RadioButton( property, value, selectedNode, deselectedNode, options ) {

    options = _.extend( {
      cursor: 'pointer',
      tandem: Tandem.tandemRequired(),
      phetioType: TRadioButton,
      enabled: true,

      // a11y
      tagName: 'input',
      inputType: 'radio',
      parentContainerTagName: 'li',
      labelTagName: 'label',
      prependLabels: true
    }, options );

    assert && assert( !options.phetioValueType, 'phetioValueType should be specified in the property, not RadioButton options' );

    var self = this;
    Node.call( this );

    // @private
    this._enabled = options.enabled;

    // @public (phet-io)
    this.phetioValueType = property.phetioValueType;

    //Add an invisible node to make sure the layout for selected vs deselected is the same
    var background = new Rectangle( selectedNode.bounds.union( deselectedNode.bounds ) );
    selectedNode.pickable = deselectedNode.pickable = false; // the background rectangle suffices

    this.addChild( background );
    this.addChild( selectedNode );
    this.addChild( deselectedNode );

    // sync control with model
    var syncWithModel = function( newValue ) {
      selectedNode.visible = (newValue === value);
      deselectedNode.visible = !selectedNode.visible;
    };
    property.link( syncWithModel );

    // set property value on fire
    var fire = function() {
      var id = options.tandem.isLegalAndUsable() && phetioEvents.start( 'user', options.tandem.id, TRadioButton, 'fired', {
        value: self.phetioValueType.toStateObject( value )
      } );
      property.set( value );
      options.tandem.isLegalAndUsable() && phetioEvents.end( id );
    };
    var buttonListener = new ButtonListener( { fire: fire } );
    this.addInputListener( buttonListener );

    // a11y - input listener so that updates the state of the radio button with keyboard interaction
    var changeListener = this.addAccessibleInputListener( {
      change: function() {
        fire();
      }
    } );

    // a11y - Specify the default value for assistive technology. This attribute is needed in addition to 
    // the 'checked' property to mark this element as the default selection since 'checked' may be set before
    // we are finished adding RadioButtons to the containing group, and the browser will remove the boolean
    // 'checked' flag when new buttons are added.
    if ( property.value === value ) {
      this.setAccessibleAttribute( 'checked', 'checked' );
    }

    // a11y - when the property changes, make sure the correct radio button is marked as 'checked' so that this button
    // receives focus on 'tab'
    var accessibleCheckedListener = function( newValue ) {
      self.accessibleChecked = newValue === value;
    };
    property.link( accessibleCheckedListener );

    // @private
    this.disposeRadioButton = function() {
      self.removeInputListener( buttonListener );
      self.removeAccessibleInputListener( changeListener );
      property.unlink( accessibleCheckedListener );
      property.unlink( syncWithModel );
    };

    this.mutate( options );
  }

  sun.register( 'RadioButton', RadioButton );

  return inherit( Node, RadioButton, {

    // @public - Provide dispose() on the prototype for ease of subclassing.
    dispose: function() {
      this.disposeRadioButton();
      Node.prototype.dispose.call( this );
    },

    /**
     * Sets the enabled state
     * @param {boolean} enabled
     * @public
     */
    setEnabled: function( enabled ) {
      this._enabled = enabled;
      this.opacity = enabled ? 1 : 0.3;
      this.pickable = enabled; // NOTE: This is a side-effect. If you set pickable independently, it will be changed when you set enabled.
    },
    set enabled( value ) { this.setEnabled( value ); },

    /**
     * Gets the enabled state
     * @returns {boolean}
     * @public
     */
    getEnabled: function() {
      return this._enabled;
    },
    get enabled() { return this.getEnabled(); }
  } );
} );
