// Copyright 2019-2022, University of Colorado Boulder

/**
 * The button on a combo box box.  Displays the current selection on the button.
 * Typically instantiated by ComboBox, not by client code.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { AriaHasPopUpMutator, GridBox, Node, Path, PDOMBehaviorFunction, PDOMPeer, TPaint } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import ButtonNode from './buttons/ButtonNode.js';
import RectangularPushButton, { RectangularPushButtonOptions } from './buttons/RectangularPushButton.js';
import sun from './sun.js';
import SunConstants from './SunConstants.js';
import VSeparatorDeprecated from './VSeparatorDeprecated.js';
import TProperty from '../../axon/js/TProperty.js';
import nullSoundPlayer from '../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import TinyProperty from '../../axon/js/TinyProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import ComboBox, { ComboBoxItem } from './ComboBox.js';
import Multilink from '../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';

// constants
const ALIGN_VALUES = [ 'left', 'center', 'right' ] as const;
const ARROW_DIRECTION_VALUES = [ 'up', 'down' ] as const;

export type ComboBoxButtonAlign = typeof ALIGN_VALUES[number];
export type ComboBoxButtonArrowDirection = typeof ARROW_DIRECTION_VALUES[number];

// The definition for how ComboBoxButton sets its accessibleName in the PDOM. See ComboBox.md for further style guide
// and documentation on the pattern.
const ACCESSIBLE_NAME_BEHAVIOR: PDOMBehaviorFunction = ( node, options, accessibleName ) => {
  options.labelTagName = 'span';
  options.labelContent = accessibleName;
  return options;
};

type SelfOptions = {
  align?: ComboBoxButtonAlign;
  arrowDirection?: ComboBoxButtonArrowDirection;
  arrowFill?: TPaint;

  // The pattern for the voicingNameResponse, with "{{value}}" provided to be filled in with
  // ComboBoxItem.a11yLabel.
  comboBoxVoicingNameResponsePattern?: TReadOnlyProperty<string> | string;

  localPreferredWidthProperty?: TReadOnlyProperty<number | null>;
  localMinimumWidthProperty?: TProperty<number | null>; // Will only be set
};

export type ComboBoxButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'children' | 'ariaLabelledbyAssociations'>;

export default class ComboBoxButton<T> extends RectangularPushButton {

  // set to true to block voicing to occur upon this button's next focus event.
  private _blockNextVoicingFocusListener: boolean;

  private readonly disposeComboBoxButton: () => void;

  // needed by methods
  private arrow: Path;
  private vSeparator: VSeparatorDeprecated;

  public constructor( property: TProperty<T>, items: ComboBoxItem<T>[], providedOptions?: ComboBoxButtonOptions ) {

    const options = optionize<ComboBoxButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      align: 'left',
      arrowDirection: 'down',
      arrowFill: 'black',

      comboBoxVoicingNameResponsePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,

      // RectangularPushButton options
      cursor: 'pointer',
      baseColor: 'white',
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      xMargin: 12,
      yMargin: 8,
      stroke: 'black',
      lineWidth: 1,
      soundPlayer: nullSoundPlayer, // disable default sound generation

      // PushButtonModel options
      enabledPropertyOptions: {
        phetioFeatured: false
      },
      visiblePropertyOptions: { phetioFeatured: false },

      localPreferredWidthProperty: new TinyProperty( null ),
      localMinimumWidthProperty: new TinyProperty( null ),

      // phet-io
      tandem: Tandem.OPTIONAL,

      // pdom
      containerTagName: 'div',
      accessibleNameBehavior: ACCESSIBLE_NAME_BEHAVIOR
    }, providedOptions );

    assert && assert( _.includes( ALIGN_VALUES, options.align ),
      `invalid align: ${options.align}` );
    assert && assert( _.includes( ARROW_DIRECTION_VALUES, options.arrowDirection ),
      `invalid arrowDirection: ${options.arrowDirection}` );

    // To improve readability
    const itemXMargin = options.xMargin;
    const itemYMargin = options.yMargin;

    // Compute max item size
    const maxItemWidthProperty = ComboBox.getMaxItemWidthProperty( items );
    const maxItemHeightProperty = ComboBox.getMaxItemHeightProperty( items );

    const arrow = new Path( null, {
      fill: options.arrowFill
    } );

    // Wrapper for the selected item's Node.
    // Do not transform ComboBoxItem.node because it is shared with ComboBoxListItemNode.
    const itemNodeWrapper = new Node( {
      layoutOptions: {
        yMargin: itemYMargin,
        grow: 1,
        xAlign: options.align
      },
      children: [
        _.find( items, item => item.value === property.value )!.node
      ]
    } );

    // Vertical separator between the item and arrow that is the full height of the button.
    const vSeparator = new VSeparatorDeprecated( 0, {
      stroke: 'black',
      lineWidth: options.lineWidth
    } );

    options.content = new GridBox( {
      rows: [ [
        itemNodeWrapper,
        vSeparator,
        arrow
      ] ]
    } );

    Multilink.multilink( [ maxItemWidthProperty, maxItemHeightProperty ], ( maxItemWidth, maxItemHeight ) => {

      const fullHeight = maxItemHeight + 2 * itemYMargin;

      // We want the arrow area to be square, see https://github.com/phetsims/sun/issues/453
      const arrowAreaSize = fullHeight;

      // The arrow is sized to fit in the arrow area, empirically determined to be visually pleasing.
      const arrowHeight = 0.35 * arrowAreaSize; // height of equilateral triangle
      const arrowWidth = 2 * arrowHeight * Math.sqrt( 3 ) / 3; // side of equilateral triangle

      const leftMargin = itemXMargin;
      const middleMargin = itemXMargin - options.lineWidth / 2; // Compensation for the separator having width
      const rightMargin = -options.lineWidth / 2; // Compensation for the separator having width

      // arrow that points up or down, to indicate which way the list pops up
      const createArrowShape = ( direction: 'up' | 'down', width: number, height: number ) => {
        if ( direction === 'up' ) {
          return new Shape()
            .moveTo( 0, height )
            .lineTo( width / 2, 0 )
            .lineTo( width, height )
            .close();
        }
        else {
          return new Shape()
            .moveTo( 0, 0 )
            .lineTo( width, 0 )
            .lineTo( width / 2, height )
            .close();
        }
      };

      arrow.shape = createArrowShape( options.arrowDirection, arrowWidth, arrowHeight );
      arrow.mutateLayoutOptions( {
        minContentWidth: arrowAreaSize,
        minContentHeight: arrowAreaSize
      } );

      itemNodeWrapper.mutateLayoutOptions( {
        minContentWidth: maxItemWidth,
        minContentHeight: maxItemHeight,
        leftMargin: leftMargin,
        rightMargin: middleMargin
      } );

      vSeparator.y2 = fullHeight;
      vSeparator.mutateLayoutOptions( {
        rightMargin: rightMargin
      } );
    } );

    // Margins are different in the item and button areas. And we want the vertical separator to extend
    // beyond the margin.  We've handled those margins above, so the actual margins propagated to the button
    // need to be zero.
    options.xMargin = 0;
    options.yMargin = 0;

    super( options );

    // Provide our minimum width back up to the ComboBox (or creator)
    this.minimumWidthProperty.link( minimumWidth => {
      options.localMinimumWidthProperty.value = minimumWidth;
    } );

    // Hook our ComboBox's preferredWidth up to ours
    const preferredWidthListener = ( preferredWidth: number | null ) => {
      this.preferredWidth = preferredWidth;
    };
    options.localPreferredWidthProperty.link( preferredWidthListener );

    this._blockNextVoicingFocusListener = false;

    this.voicingFocusListener = () => {

      // fire the listener only if we are not blocking the focus listener
      !this._blockNextVoicingFocusListener && this.defaultFocusListener();
      this._blockNextVoicingFocusListener = false;
    };

    // When Property's value changes, show the corresponding item's Node on the button.
    let item: ComboBoxItem<T> | null = null;
    const propertyObserver = ( value: T ) => {
      // remove the node for the previous item
      itemNodeWrapper.removeAllChildren();

      // find the ComboBoxItem whose value matches the property's value
      item = _.find( items, item => item.value === value )!;
      assert && assert( item, `no item found for value: ${value}` );

      // add the associated node
      itemNodeWrapper.addChild( item.node );

      // pdom
      this.innerContent = ( item.a11yLabel || null );
      this.voicingNameResponse = StringUtils.fillIn( options.comboBoxVoicingNameResponsePattern, {
        value: item.a11yLabel
      } );
    };
    property.link( propertyObserver );

    // Add aria-labelledby attribute to the button.
    // The button is aria-labelledby its own label sibling, and then (second) its primary sibling in the PDOM.
    // Order matters!
    this.ariaLabelledbyAssociations = [
      {
        otherNode: this,
        otherElementName: PDOMPeer.LABEL_SIBLING,
        thisElementName: PDOMPeer.PRIMARY_SIBLING
      },
      {
        otherNode: this,
        otherElementName: PDOMPeer.PRIMARY_SIBLING,
        thisElementName: PDOMPeer.PRIMARY_SIBLING
      }
    ];

    // signify to AT that this button opens a menu
    AriaHasPopUpMutator.mutateNode( this, 'listbox' );

    this.disposeComboBoxButton = () => {
      maxItemWidthProperty.dispose();
      maxItemHeightProperty.dispose();

      property.unlink( propertyObserver );
      options.localPreferredWidthProperty.unlink( preferredWidthListener );
    };

    this.arrow = arrow;
    this.vSeparator = vSeparator;
  }

  /**
   * Sets the button to look like a value display instead of a combo box button.
   * See https://github.com/phetsims/sun/issues/451
   */
  public setDisplayOnly( displayOnly: boolean ): void {
    this.arrow.visible = !displayOnly;
    this.vSeparator.visible = !displayOnly;
  }

  /**
   * Call to block voicing from occurring upon this button's next focus event.
   * For use by ComboBox.
   */
  public blockNextVoicingFocusListener(): void {
    this._blockNextVoicingFocusListener = true;
  }

  public override dispose(): void {
    this.disposeComboBoxButton();
    super.dispose();
  }
}

sun.register( 'ComboBoxButton', ComboBoxButton );
