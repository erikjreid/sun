// Copyright 2019, University of Colorado Boulder

/**
 * The button on a combo box box.  Displays the current selection on the button.
 * Typically instantiated by ComboBox, not by client code.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Shape = require( 'KITE/Shape' );
  const sun = require( 'SUN/sun' );
  const Tandem = require( 'TANDEM/Tandem' );
  const VSeparator = require( 'SUN/VSeparator' );

  // constants
  const ALIGN_VALUES = [ 'left', 'center', 'right' ];
  const ARROW_DIRECTION_VALUES = [ 'up', 'down' ];

  class ComboBoxButton extends RectangularPushButton {

    /**
     * @param {Property} property
     * @param {ComboBoxItem[]} items
     * @param {Object} [options]
     */
    constructor( property, items, options ) {

      options = _.extend( {

        align: 'left', // see ALIGN_VALUES
        arrowDirection: 'down', // see ARROW_DIRECTION_VALUES
        arrowFill: 'black',

        // RectangularPushButton options
        cursor: 'pointer',
        baseColor: 'white',
        buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
        xMargin: 12,
        yMargin: 8,
        stroke: 'black',
        lineWidth: 1,

        // phet-io
        tandem: Tandem.optional,

        //TODO sun#314 evaluate whether these are still needed now that ComboBoxButton extends RectangularPushButton
        // a11y
        labelTagName: 'span',
        containerTagName: 'div',
        a11yLabel: null // {string|null}

      }, options );

      assert && assert( ALIGN_VALUES.includes( options.align ),
        'invalid align: ' + options.align );
      assert && assert( ARROW_DIRECTION_VALUES.includes( options.arrowDirection ),
        'invalid arrowDirection: ' + options.arrowDirection );

      // To improve readability
      const itemXMargin = options.xMargin;

      // Compute max item size
      const maxItemWidth = _.maxBy( items, item => item.node.width ).node.width;
      const maxItemHeight = _.maxBy( items, item => item.node.height ).node.height;

      // We want the arrow area to be square, see https://github.com/phetsims/sun/issues/453
      const arrowAreaSize = ( maxItemHeight + 2 * options.yMargin );

      // The arrow is sized to fit in the arrow area, empirically determined to be visually pleasing.
      const arrowHeight = 0.35 * arrowAreaSize; // height of equilateral triangle
      const arrowWidth = 2 * arrowHeight * Math.sqrt( 3 ) / 3; // side of equilateral triangle

      // invisible horizontal struts behind item and arrow areas
      const itemAreaStrut = new HStrut( maxItemWidth + 2 * itemXMargin );
      const arrowAreaStrut = new HStrut( arrowAreaSize, {
        left: itemAreaStrut.right
      } );

      // arrow that points up or down, to indicate which way the list pops up
      let arrowShape = null;
      if ( options.arrowDirection === 'up' ) {
        arrowShape = new Shape()
          .moveTo( 0, arrowHeight )
          .lineTo( arrowWidth / 2, 0 )
          .lineTo( arrowWidth, arrowHeight )
          .close();
      }
      else {
        arrowShape = new Shape()
          .moveTo( 0, 0 )
          .lineTo( arrowWidth, 0 )
          .lineTo( arrowWidth / 2, arrowHeight )
          .close();
      }
      const arrow = new Path( arrowShape, {
        fill: options.arrowFill,
        center: arrowAreaStrut.center
      } );

      // Wrapper for the selected item's Node. Do not transform ComboBoxItem.node because it is shared with list!
      const itemNodeWrapper = new Node();

      // Vertical separator between the item and arrow that is the full height of the button.
      const separator = new VSeparator( maxItemHeight + 2 * options.yMargin, {
        stroke: 'black',
        lineWidth: options.lineWidth,
        centerX: itemAreaStrut.right,
        centerY: itemAreaStrut.centerY
      } );

      // Margins are different in the item and button areas. And we want the vertical separator to extend
      // beyond the margin.  We've handled those margins above, so the actual margins propagated to the button
      // need to be zero.
      options.xMargin = 0;
      options.yMargin = 0;

      assert && assert( !options.content, 'ComboBoxButton sets content' );
      options.content = new Node( {
        children: [ itemAreaStrut, arrowAreaStrut, itemNodeWrapper, separator, arrow ]
      } );

      super( options );

      // When property's value changes, show the corresponding item's Node on the button.
      const propertyObserver = value => {

        // remove the node for the previous item
        itemNodeWrapper.removeAllChildren();

        // find and add the node for the new item
        let node = null;
        for ( var i = 0; i < items.length && !node; i++ ) {
          if ( items[ i ].value === value ) {
            node = items[ i ].node;
          }
        }
        assert && assert( node, 'no item found for value: ' + value );
        itemNodeWrapper.addChild( node );

        // adjust alignment
        itemNodeWrapper.centerY = itemAreaStrut.centerY;
        if ( options.align === 'left' ) {
          itemNodeWrapper.left = itemAreaStrut.left + itemXMargin;
        }
        else if ( options.align === 'right' ) {
          itemNodeWrapper.right = itemAreaStrut.right - itemXMargin;
        }
        else {
          itemNodeWrapper.centerX = itemAreaStrut.centerX;
        }
      };
      property.link( propertyObserver );

      //TODO sun#314 is this handled by super? why not?
      this.labelContent = options.a11yLabel;

      //TODO sun#314 expand on this comment
      // the button is labelledby its own label, and then (second) by itself. Order matters!
      assert && assert( !options.ariaLabelledbyAssociations, 'ComboBoxButton sets ariaLabelledbyAssociations' );
      this.ariaLabelledbyAssociations = [
        {
          otherNode: this,
          otherElementName: AccessiblePeer.LABEL_SIBLING,
          thisElementName: AccessiblePeer.PRIMARY_SIBLING
        },
        {
          otherNode: this,
          otherElementName: AccessiblePeer.PRIMARY_SIBLING,
          thisElementName: AccessiblePeer.PRIMARY_SIBLING
        }
      ];

      // signify to AT that this button opens a menu
      this.setAccessibleAttribute( 'aria-haspopup', 'listbox' );

      // @private
      this.disposeComboBoxButton = () => {
        property.unlink( propertyObserver );
      };

      // @private for use via PhET-iO, see https://github.com/phetsims/sun/issues/451
      // This is NOT reset when the Reset All button is pressed.
      this.displayOnlyProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'displayOnlyProperty' ),
        phetioDocumentation: 'disables interaction with the ComboBox button and ' +
                             'makes it appear like a display that shows the current selection'
      } );
      this.displayOnlyProperty.link( displayOnly => {
        arrow.visible = !displayOnly;
        separator.visible = !displayOnly;
        this.pickable = !displayOnly;
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      this.disposeComboBoxButton();
      super.dispose();
    }
  }

  return sun.register( 'ComboBoxButton', ComboBoxButton );
} );