// Copyright 2015-2022, University of Colorado Boulder

/**
 * Demonstration of misc sun UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Property from '../../../axon/js/Property.js';
import stepTimer from '../../../axon/js/stepTimer.js';
import StringProperty from '../../../axon/js/StringProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import Range from '../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, Circle, HBox, Node, Rectangle, Text, VBox } from '../../../scenery/js/imports.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ABSwitch from '../ABSwitch.js';
import AccordionBox from '../AccordionBox.js';
import AquaRadioButtonGroup from '../AquaRadioButtonGroup.js';
import RectangularPushButton from '../buttons/RectangularPushButton.js';
import Carousel from '../Carousel.js';
import Checkbox from '../Checkbox.js';
import ComboBox from '../ComboBox.js';
import ComboBoxItem from '../ComboBoxItem.js';
import HSlider, { HSliderOptions } from '../HSlider.js';
import NumberSpinner, { NumberSpinnerOptions } from '../NumberSpinner.js';
import OnOffSwitch from '../OnOffSwitch.js';
import PageControl from '../PageControl.js';
import Panel from '../Panel.js';
import Slider, { SliderOptions } from '../Slider.js';
import sun from '../sun.js';
import sunQueryParameters from '../sunQueryParameters.js';
import ToggleSwitch from '../ToggleSwitch.js';
import VSlider, { VSliderOptions } from '../VSlider.js';
import DemosScreenView, { DemosScreenViewOptions } from './DemosScreenView.js';

type SelfOptions = EmptyObjectType;
type ButtonsScreenViewOptions = SelfOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class ComponentsScreenView extends DemosScreenView {

  public constructor( providedOptions: ButtonsScreenViewOptions ) {

    const options = optionize<ButtonsScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      selectedDemoLabel: sunQueryParameters.component
    }, providedOptions );

    super( [

      /**
       * To add a demo, add an object literal here. Each object has these properties:
       *
       * {string} label - label in the combo box
       * {function(Bounds2): Node} createNode - creates the scene graph for the demo
       */
      { label: 'ABSwitch', createNode: demoABSwitch },
      { label: 'AquaRadioButtonGroup', createNode: demoAquaRadioButtonGroup },
      { label: 'Carousel', createNode: demoCarousel },
      { label: 'Checkbox', createNode: demoCheckbox },
      { label: 'ComboBox', createNode: demoComboBox },
      { label: 'HSlider', createNode: demoHSlider },
      { label: 'VSlider', createNode: demoVSlider },
      { label: 'OnOffSwitch', createNode: demoOnOffSwitch },
      { label: 'PageControl', createNode: demoPageControl },
      { label: 'NumberSpinner', createNode: demoNumberSpinner },
      { label: 'AlignGroup', createNode: demoAlignGroup },
      { label: 'AccordionBox', createNode: demoAccordionBox },
      { label: 'ToggleSwitch', createNode: demoToggleSwitch }
    ], options );
  }
}

// Creates a demo for ABSwitch
function demoABSwitch( layoutBounds: Bounds2 ): Node {

  const property = new StringProperty( 'A' );
  const labelA = new Text( 'A', { font: new PhetFont( 24 ) } );
  const labelB = new Text( 'B', { font: new PhetFont( 24 ) } );

  return new ABSwitch( property, 'A', labelA, 'B', labelB, {
    center: layoutBounds.center,
    tandem: Tandem.OPT_OUT
  } );
}

// Creates a demo for AquaRadioButtonGroup
function demoAquaRadioButtonGroup( layoutBounds: Bounds2 ): Node {

  const font = new PhetFont( 20 );

  const horizontalChoices = [ 'left', 'center', 'right' ];
  const horizontalProperty = new StringProperty( horizontalChoices[ 0 ] );
  const horizontalItems = _.map( horizontalChoices,
    choice => {
      return {
        node: new Text( choice, { font: font } ),
        value: choice
      };
    } );
  const horizontalGroup = new AquaRadioButtonGroup( horizontalProperty, horizontalItems, {
    orientation: 'horizontal'
  } );

  const verticalChoices = [ 'top', 'center', 'bottom' ];
  const verticalProperty = new StringProperty( verticalChoices[ 0 ] );
  const verticalItems = _.map( verticalChoices,
    choice => {
      return {
        node: new Text( choice, { font: font } ),
        value: choice
      };
    } );
  const verticalGroup = new AquaRadioButtonGroup( verticalProperty, verticalItems, {
    orientation: 'vertical'
  } );

  return new VBox( {
    children: [ horizontalGroup, verticalGroup ],
    spacing: 40,
    center: layoutBounds.center
  } );
}

// Creates a demo for Carousel
function demoCarousel( layoutBounds: Bounds2 ): Node {

  // create items
  const colors = [ 'red', 'blue', 'green', 'yellow', 'pink', 'white', 'orange', 'magenta', 'purple', 'pink' ];
  const vItems: Node[] = [];
  const hItems: Node[] = [];
  colors.forEach( color => {
    vItems.push( new Rectangle( 0, 0, 60, 60, { fill: color, stroke: 'black' } ) );
    hItems.push( new Circle( 30, { fill: color, stroke: 'black' } ) );
  } );

  // vertical carousel
  const vCarousel = new Carousel( vItems, {
    orientation: 'vertical',
    separatorsVisible: true,
    buttonTouchAreaXDilation: 5,
    buttonTouchAreaYDilation: 15,
    buttonMouseAreaXDilation: 2,
    buttonMouseAreaYDilation: 7
  } );

  // horizontal carousel
  const hCarousel = new Carousel( hItems, {
    orientation: 'horizontal',
    buttonTouchAreaXDilation: 15,
    buttonTouchAreaYDilation: 5,
    buttonMouseAreaXDilation: 7,
    buttonMouseAreaYDilation: 2,
    centerX: vCarousel.centerX,
    top: vCarousel.bottom + 50
  } );

  // button that scrolls the horizontal carousel to a specific item
  const itemIndex = 4;
  const hScrollToItemButton = new RectangularPushButton( {
    content: new Text( `scroll to item ${itemIndex}`, { font: new PhetFont( 20 ) } ),
    listener: () => hCarousel.scrollToItem( hItems[ itemIndex ] )
  } );

  // button that sets the horizontal carousel to a specific page number
  const pageNumber = 0;
  const hScrollToPageButton = new RectangularPushButton( {
    content: new Text( `scroll to page ${pageNumber}`, { font: new PhetFont( 20 ) } ),
    listener: () => hCarousel.pageNumberProperty.set( pageNumber )
  } );

  // group the buttons
  const buttonGroup = new VBox( {
    children: [ hScrollToItemButton, hScrollToPageButton ],
    align: 'left',
    spacing: 7,
    left: hCarousel.right + 30,
    centerY: hCarousel.centerY
  } );

  return new Node( {
    children: [ vCarousel, hCarousel, buttonGroup ],
    center: layoutBounds.center
  } );
}

// Creates a demo for Checkbox
function demoCheckbox( layoutBounds: Bounds2 ): Node {

  const property = new BooleanProperty( true );
  const enabledProperty = new BooleanProperty( true, { phetioFeatured: true } );

  const checkbox = new Checkbox( new Text( 'My Awesome Checkbox', {
    font: new PhetFont( 30 )
  } ), property, {
    enabledProperty: enabledProperty
  } );

  const enabledCheckbox = new Checkbox( new Text( 'enabled', {
    font: new PhetFont( 20 )
  } ), enabledProperty );

  return new VBox( {
    children: [ checkbox, enabledCheckbox ],
    spacing: 30,
    center: layoutBounds.center
  } );
}

// Creates a demo of ComboBox
function demoComboBox( layoutBounds: Bounds2 ): Node {

  const labels = [ 'one', 'two', 'three', 'four', 'five', 'six' ];
  const items: ComboBoxItem<string>[] = [];
  labels.forEach( label => {
    items.push( new ComboBoxItem<string>( new Text( label, { font: new PhetFont( { size: 20 } ) } ), label ) );
  } );

  const selectedItemProperty = new Property( labels[ 0 ] );

  const listParent = new Node();

  const enabledProperty = new BooleanProperty( true );

  const comboBox = new ComboBox( items, selectedItemProperty, listParent, {
    highlightFill: 'yellow',
    listPosition: 'above',
    enabledProperty: enabledProperty
  } );

  const enabledCheckbox = new Checkbox( new Text( 'enabled', { font: new PhetFont( 20 ) } ), enabledProperty );

  const uiComponents = new VBox( {
    children: [ comboBox, enabledCheckbox ],
    spacing: 40,
    center: layoutBounds.center
  } );

  return new Node( { children: [ uiComponents, listParent ] } );
}

// Creates a demo for HSlider
function demoHSlider( layoutBounds: Bounds2, options?: PhetioObjectOptions ): Node {
  return demoSlider( layoutBounds, 'horizontal', options );
}

// Creates a demo for VSlider
function demoVSlider( layoutBounds: Bounds2, options?: PhetioObjectOptions ): Node {
  return demoSlider( layoutBounds, 'vertical', options );
}

/**
 * Used by demoHSlider and demoVSlider
 */
function demoSlider( layoutBounds: Bounds2, orientation: 'horizontal' | 'vertical', providedOptions?: SliderOptions ): Node {

  const options = combineOptions<SliderOptions>( {
    center: layoutBounds.center,
    tandem: Tandem.REQUIRED,
    phetioDesigned: true
  }, providedOptions );

  const property = new Property( 0 );
  const range = new Range( 0, 100 );
  const tickLabelOptions = { font: new PhetFont( 16 ) };

  const enabledRangeProperty = new Property( new Range( 0, 100 ) );

  let slider: Slider;
  if ( orientation === 'horizontal' ) {
    slider = new HSlider( property, range, combineOptions<HSliderOptions>( options, {
      trackSize: new Dimension2( 300, 5 ),

      // Demonstrate larger x dilation.
      thumbTouchAreaXDilation: 30,
      thumbTouchAreaYDilation: 15,
      thumbMouseAreaXDilation: 10,
      thumbMouseAreaYDilation: 5,
      enabledRangeProperty: enabledRangeProperty,

      phetioEnabledPropertyInstrumented: false
    } ) );
  }
  else {
    slider = new VSlider( property, range, combineOptions<VSliderOptions>( options, {
      trackSize: new Dimension2( 5, 300 ),

      // Demonstrate larger y dilation, to verify that VSlider is handling things correctly.
      thumbTouchAreaXDilation: 15,
      thumbTouchAreaYDilation: 30,
      thumbMouseAreaXDilation: 5,
      thumbMouseAreaYDilation: 10,
      enabledRangeProperty: enabledRangeProperty,

      phetioEnabledPropertyInstrumented: false
    } ) );
  }

  // Settable
  const enabledProperty = new BooleanProperty( true );
  slider.enabledProperty = enabledProperty;

  // major ticks
  slider.addMajorTick( range.min, new Text( range.min, tickLabelOptions ) );
  slider.addMajorTick( range.getCenter(), new Text( range.getCenter(), tickLabelOptions ) );
  slider.addMajorTick( range.max, new Text( range.max, tickLabelOptions ) );

  // minor ticks
  slider.addMinorTick( range.min + 0.25 * range.getLength() );
  slider.addMinorTick( range.min + 0.75 * range.getLength() );

  // show/hide major ticks
  const majorTicksVisibleProperty = new Property( true );
  majorTicksVisibleProperty.link( visible => {
    slider.majorTicksVisible = visible;
  } );
  const majorTicksCheckbox = new Checkbox( new Text( 'Major ticks visible', { font: new PhetFont( 20 ) } ),
    majorTicksVisibleProperty, {
      tandem: Tandem.OPT_OUT,
      left: slider.left,
      top: slider.bottom + 40
    } );

  // show/hide minor ticks
  const minorTicksVisibleProperty = new Property( true );
  minorTicksVisibleProperty.link( visible => {
    slider.minorTicksVisible = visible;
  } );
  const minorTicksCheckbox = new Checkbox( new Text( 'Minor ticks visible', { font: new PhetFont( 20 ) } ),
    minorTicksVisibleProperty, {
      tandem: Tandem.OPT_OUT,
      left: slider.left,
      top: majorTicksCheckbox.bottom + 40
    } );

  // Checkbox to enable/disable slider
  const enabledCheckbox = new Checkbox( new Text( 'Enable slider', { font: new PhetFont( 20 ) } ),
    enabledProperty, {
      tandem: Tandem.OPT_OUT,
      left: slider.left,
      top: minorTicksCheckbox.bottom + 40
    } );

  // restrict enabled range of slider
  const restrictedRangeProperty = new Property( false );
  restrictedRangeProperty.link( restrictedRange => {
    enabledRangeProperty.value = restrictedRange ? new Range( 25, 75 ) : new Range( 0, 100 );
  } );

  const enabledRangeCheckbox = new Checkbox( new Text( 'Enable Range [25, 75]', { font: new PhetFont( 20 ) } ),
    restrictedRangeProperty, {
      tandem: Tandem.OPT_OUT,
      left: slider.left,
      top: enabledCheckbox.bottom + 40
    } );

  // If the user is holding down the thumb outside of the enabled range, and the enabled range expands, the value should
  // adjust to the new extremum of the range, see https://github.com/phetsims/mean-share-and-balance/issues/29
  const animateEnabledRangeProperty = new BooleanProperty( false );
  const animateEnabledRangeCheckbox = new Checkbox( new Text( 'Animate Enabled Range', { font: new PhetFont( 20 ) } ),
    animateEnabledRangeProperty, {
      tandem: Tandem.OPT_OUT,
      left: slider.left,
      top: enabledRangeCheckbox.bottom + 40
    } );

  stepTimer.addListener( () => {
    if ( animateEnabledRangeProperty.value ) {
      enabledRangeProperty.value = new Range( Math.max( enabledRangeProperty.value.min - 0.1, 0 ), 75 );
    }
  } );

  // All of the controls related to the slider
  const controls = new VBox( {
    align: 'left',
    spacing: 30,
    children: [ majorTicksCheckbox, minorTicksCheckbox, enabledCheckbox, enabledRangeCheckbox, animateEnabledRangeCheckbox ]
  } );

  // Position the control based on the orientation of the slider
  const boxOptions = {
    spacing: 60,
    children: [ slider, controls ],
    center: layoutBounds.center
  };
  let box = null;
  if ( orientation === 'horizontal' ) {
    box = new VBox( boxOptions );
  }
  else {
    box = new HBox( boxOptions );
  }

  return box;
}

function demoToggleSwitch( layoutBounds: Bounds2 ): Node {
  return new ToggleSwitch( new StringProperty( 'left' ), 'left', 'right', {
    center: layoutBounds.center
  } );
}

// Creates a demo for OnOffSwitch
function demoOnOffSwitch( layoutBounds: Bounds2 ): Node {
  return new OnOffSwitch( new BooleanProperty( true ), {
    center: layoutBounds.center
  } );
}

// Creates a demo for PageControl
function demoPageControl( layoutBounds: Bounds2 ): Node {

  // create items
  const colors = [ 'red', 'blue', 'green', 'yellow', 'pink', 'white', 'orange', 'magenta', 'purple', 'pink' ];
  const items: Node[] = [];
  colors.forEach( color => {
    items.push( new Rectangle( 0, 0, 100, 100, { fill: color, stroke: 'black' } ) );
  } );

  // carousel
  const carousel = new Carousel( items, {
    orientation: 'horizontal',
    itemsPerPage: 3
  } );

  // page control
  const pageControl = new PageControl( carousel.numberOfPages, carousel.pageNumberProperty, {
    orientation: 'horizontal',
    interactive: true,
    dotRadius: 10,
    dotSpacing: 18,
    dotTouchAreaDilation: 8,
    dotMouseAreaDilation: 4,
    currentPageFill: 'white',
    currentPageStroke: 'black',
    centerX: carousel.centerX,
    top: carousel.bottom + 10
  } );

  return new Node( {
    children: [ carousel, pageControl ],
    center: layoutBounds.center
  } );
}

// Creates a demo for NumberSpinner
function demoNumberSpinner( layoutBounds: Bounds2 ): Node {

  const valueProperty = new Property( 0 );
  const valueRangeProperty = new Property( new Range( -5, 5 ) );
  const enabledProperty = new Property( true );

  // options for all spinners
  const spinnerOptions: NumberSpinnerOptions = {
    enabledProperty: enabledProperty,
    deltaValue: 0.1,
    touchAreaXDilation: 20,
    touchAreaYDilation: 10,
    mouseAreaXDilation: 10,
    mouseAreaYDilation: 5,
    numberDisplayOptions: {
      decimalPlaces: 1,
      align: 'center',
      xMargin: 10,
      yMargin: 3,
      minBackgroundWidth: 100,
      textOptions: {
        font: new PhetFont( 28 )
      }
    }
  };

  // Demonstrate each value of options.arrowsPosition
  const spinnerLeftRight = new NumberSpinner( valueProperty, valueRangeProperty,
    combineOptions<NumberSpinnerOptions>( {}, spinnerOptions, {
      arrowsPosition: 'leftRight',
      numberDisplayOptions: {
        valuePattern: '{{value}} bottles of beer on the wall'
      }
    } ) );

  const spinnerTopBottom = new NumberSpinner( valueProperty, valueRangeProperty,
    combineOptions<NumberSpinnerOptions>( {}, spinnerOptions, {
      arrowsPosition: 'topBottom',
      arrowsScale: 0.65
    } ) );

  const spinnerBothRight = new NumberSpinner( valueProperty, valueRangeProperty,
    combineOptions<NumberSpinnerOptions>( {}, spinnerOptions, {
      arrowsPosition: 'bothRight',
      numberDisplayOptions: {
        yMargin: 10,
        align: 'right'
      }
    } ) );

  const spinnerBothBottom = new NumberSpinner( valueProperty, valueRangeProperty,
    combineOptions<NumberSpinnerOptions>( {}, spinnerOptions, {
      arrowsPosition: 'bothBottom',
      numberDisplayOptions: {
        backgroundFill: 'pink',
        backgroundStroke: 'red',
        backgroundLineWidth: 3,
        align: 'left'
      },
      arrowButtonFill: 'lightblue',
      arrowButtonStroke: 'blue',
      arrowButtonLineWidth: 0.2
    } ) );

  const enabledCheckbox = new Checkbox( new Text( 'enabled', { font: new PhetFont( 20 ) } ), enabledProperty );

  return new VBox( {
    children: [ spinnerTopBottom, spinnerBothRight, spinnerBothBottom, spinnerLeftRight, enabledCheckbox ],
    spacing: 40,
    center: layoutBounds.center
  } );
}

function demoAlignGroup( layoutBounds: Bounds2 ): Node {

  function highlightWrap( node: Node ): Node {
    const rect = Rectangle.bounds( node.bounds, { fill: 'rgba(0,0,0,0.25)' } );
    node.boundsProperty.lazyLink( () => {
      rect.setRectBounds( node.bounds );
    } );
    return new Node( {
      children: [
        rect,
        node
      ]
    } );
  }

  // Scheduling randomness in stepTimer on startup leads to a different number of calls in the upstream and downstream
  // sim in the playback wrapper.  This workaround uses Math.random() to avoid a mismatch in the number of dotRandom calls.
  const stepRand = () => {
    return Math.random(); // eslint-disable-line bad-sim-text
  };
  const iconGroup = new AlignGroup();
  const iconRow = new HBox( {
    spacing: 10,
    children: _.range( 1, 10 ).map( () => {
      const randomRect = new Rectangle( 0, 0, dotRandom.nextDouble() * 60 + 10, dotRandom.nextDouble() * 60 + 10, {
        fill: 'black'
      } );
      stepTimer.addListener( () => {
        if ( stepRand() < 0.02 ) {
          randomRect.rectWidth = stepRand() * 60 + 10;
          randomRect.rectHeight = stepRand() * 60 + 10;
        }
      } );
      return new AlignBox( randomRect, {
        group: iconGroup,
        margin: 5
      } );
    } ).map( highlightWrap )
  } );

  const panelGroup = new AlignGroup( { matchVertical: false } );

  function randomText(): Text {
    const text = new Text( 'Test', { fontSize: 20 } );
    stepTimer.addListener( () => {
      if ( stepRand() < 0.03 ) {
        let string = '';
        while ( stepRand() < 0.94 && string.length < 20 ) {
          string += ( `${stepRand()}` ).slice( -1 );
        }
        text.text = string;
      }
    } );
    return text;
  }

  const panelRow = new VBox( {
    spacing: 10,
    children: [
      new Panel( new AlignBox( randomText(), { group: panelGroup } ) ),
      new Panel( new AlignBox( new VBox( {
        spacing: 3,
        children: [
          randomText(),
          randomText()
        ]
      } ), { group: panelGroup } ) )
    ]
  } );

  return new VBox( {
    spacing: 20,
    children: [ iconRow, panelRow ],
    center: layoutBounds.center
  } );
}

function demoAccordionBox( layoutBounds: Bounds2 ): Node {
  const randomRect = new Rectangle( 0, 0, 100, 50, { fill: 'red' } );

  const resizeButton = new RectangularPushButton( {
    content: new Text( 'Resize', { font: new PhetFont( 20 ) } ),
    listener: () => {
      randomRect.rectWidth = 50 + dotRandom.nextDouble() * 150;
      randomRect.rectHeight = 50 + dotRandom.nextDouble() * 150;
      box.center = layoutBounds.center;
    }
  } );

  const box = new AccordionBox( new VBox( {
    spacing: 10,
    children: [
      resizeButton,
      randomRect
    ]
  } ), {
    resize: true,
    center: layoutBounds.center
  } );

  return box;
}

sun.register( 'ComponentsScreenView', ComponentsScreenView );