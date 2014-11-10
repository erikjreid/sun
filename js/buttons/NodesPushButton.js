// Copyright 2002-2014, University of Colorado Boulder

/**
 * A push button whose appearance is based on a set of scenery Nodes, one node for each button 'interaction state'.
 * Unlike other sun buttons, this button does not have a separate 'view' type, because the Nodes provided determine
 * the appearance of the button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // import
  var ButtonListener = require( 'SUN/buttons/ButtonListener' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PushButtonInteractionStateProperty = require( 'SUN/buttons/PushButtonInteractionStateProperty' );
  var PushButtonModel = require( 'SUN/buttons/PushButtonModel' );

  /**
   * @param {Node} upNode
   * @param {Node} overNode
   * @param {Node} pressedNode
   * @param {Node} disabledNode
   * @param {Object} [options]
   * @constructor
   */
  function NodesPushButton( idleNode, overNode, pressedNode, disabledNode, options ) {

    options = _.extend( {
      cursor: 'pointer', // {string}
      enabled: true, // {boolean}
      listener: null, // {function}
      alignX: 'center', // {string} how the nodes are horizontally aligned: center, left, right
      alignY: 'center' // {string} how the nodes are vertically aligned: center, top, bottom
    }, options );
    options.children = [ idleNode, overNode, pressedNode, disabledNode ];

    Node.call( this );

    // Button model
    this.buttonModel = new PushButtonModel( options ); // @private
    this.addInputListener( new ButtonListener( this.buttonModel ) );

    // Button interactions
    var interactionStateProperty = new PushButtonInteractionStateProperty( this.buttonModel );
    interactionStateProperty.link( function( interactionState ) {
      idleNode.visible = ( interactionState === 'idle' );
      overNode.visible = ( interactionState === 'over' );
      pressedNode.visible = ( interactionState === 'pressed' );
      disabledNode.visible = ( interactionState === 'disabled' );
    } );

    //TODO this alignment feature would be useful to extract into a general scenery node
    // Alignment of nodes
    var nodes = options.children;
    for ( var i = 1; i < nodes.length; i++ ) {

      // x alignment
      switch( options.alignX ) {
        case 'center':
          nodes[i].centerX = nodes[0].centerX;
          break;
        case 'left':
          nodes[i].left = nodes[0].left;
          break;
        case 'right':
          nodes[i].right = nodes[0].right;
          break;
        default:
          throw new Error( 'unsupported alignX: ' + options.alignX );
      }

      // y alignment
      switch( options.alignY ) {
        case 'center':
          nodes[i].centerY = nodes[0].centerY;
          break;
        case 'top':
          nodes[i].top = nodes[0].top;
          break;
        case 'bottom':
          nodes[i].bottom = nodes[0].bottom;
          break;
        default:
          throw new Error( 'unsupported alignY: ' + options.alignY );
      }
    }

    this.mutate( options );
  }

  return inherit( Node, NodesPushButton, {

    // Adds a {function} listener.
    addListener: function( listener ) { this.buttonModel.addListener( listener ); },

    // Removes a {function} listener.
    removeListener: function( listener ) { this.buttonModel.removeListener( listener ); },

    // Enables or disables the button.
    set enabled( value ) { this.buttonModel.enabled = !!value; },

    // Is the button enabled?
    get enabled() { return this.buttonModel.enabled; }
  }, {

    /**
     * Creates a button based on image files.
     * @param {HTMLImageElement} upImage
     * @param {HTMLImageElement} overImage
     * @param {HTMLImageElement} downImage
     * @param {HTMLImageElement} disabledImage
     * @param {Object} [options]
     * @returns {NodesPushButton}
     * @static
     */
    createImageButton: function( upImage, overImage, downImage, disabledImage, options ) {
      return new NodesPushButton( new Image( upImage ), new Image( overImage ), new Image( downImage ), new Image( disabledImage ), options );
    }
  } );
} );