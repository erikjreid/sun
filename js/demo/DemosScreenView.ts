// Copyright 2015-2022, University of Colorado Boulder

/**
 * Base type for ScreenViews that use a carousel to select a demo.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import ScreenView, { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import optionize from '../../../phet-core/js/optionize.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CarouselComboBox from '../CarouselComboBox.js';
import ComboBoxItem from '../ComboBoxItem.js';
import sun from '../sun.js';

// constants
const ITEM_FONT = new PhetFont( 14 );

export type SunDemo = {

  // string used to label the demo in ComboBox
  label: string;

  // creates the Node for the demo
  createNode: ( layoutBounds: Bounds2, options?: any ) => Node;

  node?: Node | null | undefined;
}

type SelfOptions = {

  // label field of the {SunDemo} to be selected initially, defaults to the first demo after sorting
  selectedDemoLabel?: string | null;

  // See https://github.com/phetsims/sun/issues/386
  // true = caches Nodes for all demos that have been selected
  // false = keeps only the Node for the selected demo in memory
  cacheDemos?: boolean;
};

export type DemosScreenViewOptions = SelfOptions & ScreenViewOptions;

class DemosScreenView extends ScreenView {

  /**
   * @param demos
   * @param providedOptions
   */
  constructor( demos: SunDemo[], providedOptions?: DemosScreenViewOptions ) {

    const options = optionize<DemosScreenViewOptions, SelfOptions, ScreenViewOptions, 'tandem'>( {

      // DemosScreenViewOptions
      selectedDemoLabel: null,
      cacheDemos: false,

      // ScreenViewOptions
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    super( options );

    const demosParent = new Node();
    const layoutBounds = this.layoutBounds;

    // Support PhET-iO API instrumentation and API tracking
    if ( Tandem.PHET_IO_ENABLED ) {
      options.cacheDemos = true;

      demos.forEach( ( demo: SunDemo ) => {
        demo.node = demo.createNode( layoutBounds, {
          tandem: options.tandem.createTandem( `demo${demo.label}` )
        } );
        demo.node.visible = false;
        demosParent.addChild( demo.node );
      } );
    }

    // All demos will be children of this node, to maintain rendering order with combo box list

    this.addChild( demosParent );

    // Sort the demos by label, so that they appear in the combo box in alphabetical order
    demos = _.sortBy( demos, ( demo: SunDemo ) => {
      return demo.label;
    } );

    // The initial demo that is selected
    let selectedDemo: SunDemo | undefined = demos[ 0 ];
    if ( options.selectedDemoLabel ) {
      selectedDemo = _.find( demos, ( demo: SunDemo ) => {
        return ( demo.label === options.selectedDemoLabel );
      } );
      if ( !selectedDemo ) {
        throw new Error( `demo not found: ${options.selectedDemoLabel}` );
      }
    }

    // {Property.<Demo>} the demo that is currently selected
    const selectedDemoProperty = new Property<SunDemo>( selectedDemo );

    const selectADemoLabel = new Text( 'Select a Demo:', {
      font: new PhetFont( 16 )
    } );
    this.addChild( selectADemoLabel );

    // {ComboBoxItem[]}
    const items = demos.map( ( demo: SunDemo ) => new ComboBoxItem( new Text( demo.label, { font: ITEM_FONT } ), demo ) );

    const carouselComboBox = new CarouselComboBox( selectedDemoProperty, items, {
      tandem: options.tandem.createTandem( 'carouselComboBox' )
    } );
    this.addChild( carouselComboBox );

    // Layout, with button vertically centered on label.
    selectADemoLabel.left = this.layoutBounds.left + 20;
    carouselComboBox.left = selectADemoLabel.right + 10;
    carouselComboBox.top = this.layoutBounds.top + 20;
    selectADemoLabel.centerY = carouselComboBox.visibleBounds.centerY;

    // Make the selected demo visible
    selectedDemoProperty.link( ( demo: SunDemo, oldDemo: SunDemo | null ) => {

      // clean up the previously selected demo
      if ( oldDemo ) {

        const oldDemoNode = oldDemo.node!;

        if ( options.cacheDemos ) {

          // make the old demo invisible
          oldDemoNode.visible = false;
        }
        else {

          // delete the old demo
          demosParent.removeChild( oldDemoNode );
          oldDemoNode.dispose();
          oldDemo.node = null;
        }
      }

      if ( demo.node ) {

        // If the selected demo has an associated node, make it visible.
        demo.node.visible = true;
      }
      else {

        // If the selected demo doesn't doesn't have an associated node, create it.
        demo.node = demo.createNode( layoutBounds, {
          tandem: options.tandem.createTandem( `demo${demo.label}` )
        } );
        demosParent.addChild( demo.node );
      }
    } );
  }
}

sun.register( 'DemosScreenView', DemosScreenView );
export default DemosScreenView;