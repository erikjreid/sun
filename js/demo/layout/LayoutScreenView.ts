// Copyright 2022, University of Colorado Boulder

/**
 * Demos for the recommended layout patterns
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Constructor from '../../../../phet-core/js/types/Constructor.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, Circle, Color, FlowBox, FlowCell, FlowConstraint, GridBackgroundNode, GridBox, TPaint, ManualConstraint, Node, Path, Rectangle, RectangleOptions, Text, TextOptions, HSeparator } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Checkbox from '../../Checkbox.js';
import Panel from '../../Panel.js';
import sun from '../../sun.js';
import sunQueryParameters from '../../sunQueryParameters.js';
import DemosScreenView, { DemosScreenViewOptions } from '../DemosScreenView.js';
import RectangularPushButton from '../../buttons/RectangularPushButton.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;
type LayoutScreenViewOptions = SelfOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class LayoutScreenView extends DemosScreenView {

  public constructor( providedOptions: LayoutScreenViewOptions ) {

    const options = optionize<LayoutScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      selectedDemoLabel: sunQueryParameters.layout
    }, providedOptions );

    // To add a demo, add an entry here of type SunDemo.
    const demos = [
      { label: 'Width of multiple panels', createNode: demoMultiplePanels, tandemName: 'multiplePanels' },
      { label: 'Separators', createNode: demoSeparators, tandemName: 'separators' },
      { label: 'Manual constraint', createNode: demoManualConstraint, tandemName: 'manualConstraint' },
      { label: 'Checkboxes with icons', createNode: demoCheckboxesWithIcons, tandemName: 'checkboxesWithIcons' },
      { label: 'Disconnected flow', createNode: demoDisconnectedFlow, tandemName: 'disconnectedFlow' },
      { label: 'Origin', createNode: demoOrigin, tandemName: 'origin' },
      { label: 'Flow stress test', createNode: demoFlowStressTest, tandemName: 'flowStressTest' },
      { label: 'Grid stress test', createNode: demoGridStressTest, tandemName: 'gridStressTest' },
      { label: 'Sizable buttons', createNode: demoSizableButtons, tandemName: 'sizableButtons' },
      { label: 'Test', createNode: demoTest, tandemName: 'test' }
    ];

    super( demos, options );
  }
}

const colors = [
  new Color( 62, 171, 3 ),
  new Color( 23, 180, 77 ),
  new Color( 24, 183, 138 ),
  new Color( 23, 178, 194 ),
  new Color( 20, 163, 238 ),
  new Color( 71, 136, 255 ),
  new Color( 171, 101, 255 ),
  new Color( 228, 72, 235 ),
  new Color( 252, 66, 186 ),
  new Color( 252, 82, 127 )
];

const MARGIN = 10;
const BOX_WIDTH = 14;

const normalText = ( str: string, options?: TextOptions ) => new Text( str, combineOptions<TextOptions>( {
  font: new PhetFont( 12 )
}, options ) );
const sectionText = ( str: string, options?: TextOptions ) => new Text( str, combineOptions<TextOptions>( {
  font: new PhetFont( { size: 14, weight: 'bold' } )
}, options ) );
const bigText = ( str: string, options?: TextOptions ) => new Text( str, combineOptions<TextOptions>( {
  font: new PhetFont( { size: 18, weight: 'bold' } )
}, options ) );

const overrideDispose = <T extends Constructor<Node>>( node: InstanceType<T>, Type: T, callback: () => void ) => {
  node.dispose = function( this: InstanceType<T> ) {
    callback();

    Type.prototype.dispose.call( this );
  };

  return node;
};

const onElapsed = ( callback: ( elapsedTime: number ) => void ): ( () => void ) => {
  let elapsedTime = 0;

  const step = ( dt: number ) => {
    elapsedTime += dt;
    callback( elapsedTime );
  };

  callback( elapsedTime );

  stepTimer.addListener( step );

  return () => stepTimer.removeListener( step );
};

const createBooleanProperty = ( value = false ) => {
  return new BooleanProperty( value, { tandem: Tandem.OPT_OUT } );
};

// A rectangle whose width animates to grow and shrink to a provided max and min.
const createHorizontalResizer = ( height: number, minWidth: number, maxWidth: number, providedOptions?: RectangleOptions ): Node => {
  const result = new Rectangle( combineOptions<RectangleOptions>( {
    fill: 'green',
    rectHeight: height
  }, providedOptions ) );

  return overrideDispose( result, Rectangle, onElapsed( ( elapsedTime: number ) => {
    result.rectWidth = ( minWidth + maxWidth ) / 2 + Math.cos( elapsedTime ) * ( maxWidth - minWidth ) / 2;
  } ) );
};

// A rectangle whose visibility is enabled/disabled according to a consistent elapsed time.
const createDisappearing = ( width: number, height: number ): Node => {
  const result = new Rectangle( {
    fill: 'green',
    rectWidth: width,
    rectHeight: height
  } );

  return overrideDispose( result, Rectangle, onElapsed( ( elapsedTime: number ) => {
    result.visible = Math.floor( elapsedTime ) % 2 === 0;
  } ) );
};

/**
 * A demonstration of dynamic layout applied to multiple panels. panelB contains a resizer that animates to
 * adjust bounds of its parent FlowBox and Panel. panelA will stretch to match panelB's bounds accordingly.
 * @param layoutBounds
 */
function demoMultiplePanels( layoutBounds: Bounds2 ): Node {
  const resizer = createHorizontalResizer( 15, 30, 200 );

  const panelA = new Panel( new FlowBox( {
    orientation: 'vertical',
    align: 'left',
    stretch: true,
    spacing: 5,
    children: [
      sectionText( 'Checkboxes' ),
      new Checkbox( createBooleanProperty( false ), normalText( 'First checkbox' ), {
        boxWidth: BOX_WIDTH
      } ),
      new Checkbox( createBooleanProperty( false ), normalText( 'Second checkbox' ), {
        boxWidth: BOX_WIDTH
      } )
    ]
  } ) );

  const panelB = new Panel( new FlowBox( {
    orientation: 'vertical',
    align: 'left',
    spacing: 5,
    children: [
      sectionText( 'Resizing' ),
      resizer
    ]
  } ) );

  const panelsNode = new FlowBox( {
    orientation: 'vertical',

    // This sets the default alignment to stretch (NOTE: this could also be provided in panelA/panelB's layoutOptions)
    stretch: true,

    spacing: MARGIN,
    children: [
      panelA,
      panelB
    ]
  } );

  const alignBox = new AlignBox( panelsNode, { alignBounds: layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top' } );

  return overrideDispose( alignBox, AlignBox, () => resizer.dispose() );
}

/**
 * A disappearing node demonstrates how separators dynamically react to content being added or removed in a panel.
 * @param layoutBounds
 */
function demoSeparators( layoutBounds: Bounds2 ): Node {
  const disappearing = createDisappearing( 150, 100 );

  const panel = new Panel( new FlowBox( {
    orientation: 'vertical',
    align: 'left',
    spacing: 5,
    children: [
      new HSeparator(),
      sectionText( 'Disappearing node?:' ),
      new HSeparator(),
      disappearing,
      new HSeparator()
    ]
  } ) );

  const alignBox = new AlignBox( panel, { alignBounds: layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top' } );

  return overrideDispose( alignBox, AlignBox, () => disappearing.dispose() );
}

/**
 * Demonstrates how Checkboxes with icons will react when resizing of a panel occurs. Icons default to right align
 * with the parent panel.
 *
 * Checkbox types included in demo: default, indented, scaled, reflected, and nested.
 * @param layoutBounds
 */
function demoCheckboxesWithIcons( layoutBounds: Bounds2 ): Node {
  const resizer = createHorizontalResizer( 15, 30, 200 );

  const panel = new Panel( new FlowBox( {
    orientation: 'vertical',
    stretch: true,
    align: 'left',
    spacing: 5,
    children: [
      sectionText( 'Checks' ),
      new Checkbox( createBooleanProperty(), new FlowBox( {
        spacing: 10,
        children: [
          normalText( 'First' ),
          new Rectangle( 0, 0, 14, 14, { fill: 'red' } )
        ]
      } ), {
        boxWidth: BOX_WIDTH
      } ),
      new Checkbox( createBooleanProperty(), new FlowBox( {
        spacing: 10,
        children: [
          normalText( 'Second' ),
          new Rectangle( 0, 0, 14, 14, { fill: 'magenta' } )
        ]
      } ), {
        boxWidth: BOX_WIDTH
      } ),
      new Checkbox( createBooleanProperty(), new FlowBox( {
        spacing: 10,
        children: [
          normalText( 'Indent' ),
          new Rectangle( 0, 0, 14, 14, { fill: 'blue' } )
        ]
      } ), {
        boxWidth: BOX_WIDTH,
        layoutOptions: {
          leftMargin: 20
        }
      } ),
      new Checkbox( createBooleanProperty(), new FlowBox( {
        spacing: 10,
        scale: 0.7,
        children: [
          normalText( 'Scaled 1' ),
          new Rectangle( 0, 0, 14, 14, { fill: 'orange' } )
        ]
      } ), {
        boxWidth: BOX_WIDTH
      } ),
      new Checkbox( createBooleanProperty(), new FlowBox( {
        spacing: 10,
        children: [
          normalText( 'Scaled 2' ),
          new Rectangle( 0, 0, 14, 14, { fill: 'orange' } )
        ]
      } ), {
        boxWidth: BOX_WIDTH,
        scale: 0.7
      } ),
      new Checkbox( createBooleanProperty(), new FlowBox( {
        spacing: 10,
        children: [
          normalText( 'Reflected' ),
          new Rectangle( 0, 0, 14, 14, { fill: 'orange' } )
        ]
      } ), {
        boxWidth: BOX_WIDTH,
        scale: new Vector2( -1, 1 )
      } ),
      new FlowBox( {
        orientation: 'vertical',
        spacing: 5,
        stretch: true,
        layoutOptions: { leftMargin: 20 },
        children: [
          new Checkbox( createBooleanProperty(), new FlowBox( {
            stretch: true,
            spacing: 10,
            children: [
              normalText( 'Nested 1' ),
              new Rectangle( 0, 0, 14, 14, { fill: 'black' } )
            ]
          } ), {
            boxWidth: BOX_WIDTH
          } ),
          new Checkbox( createBooleanProperty(), new FlowBox( {
            spacing: 10,
            children: [
              normalText( 'Nested 2' ),
              new Rectangle( 0, 0, 14, 14, { fill: 'black' } )
            ]
          } ), {
            boxWidth: BOX_WIDTH
          } )
        ]
      } ),
      sectionText( 'Resizing' ),
      resizer
    ]
  } ) );

  const alignBox = new AlignBox( panel, { alignBounds: layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top' } );

  return overrideDispose( alignBox, AlignBox, () => resizer.dispose() );
}

/**
 * A resizer animates to demonstrate how Manual Constraint can connect the layout of two separate nodes. The
 * position of the leftText stays aligned with the position of the rightText as the rightText's y coordinate changes.
 * @param layoutBounds
 */
function demoManualConstraint( layoutBounds: Bounds2 ): Node {
  const rightText = normalText( 'Text aligned on right' );
  const leftText = normalText( 'Text aligned on left' );
  const resizer = createHorizontalResizer( 30, 50, 200, { rotation: Math.PI / 2 } );
  const panel = new Panel( new FlowBox( {
    orientation: 'vertical',
    align: 'left',
    spacing: 5,
    children: [
      resizer,
      rightText
    ]
  } ) );


  const alignBox = new AlignBox( panel, { alignBounds: layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top' } );

  const node = new Node();

  // Can create the constraint before things are connected (it will listen)
  ManualConstraint.create( node, [ leftText, rightText, panel ], ( leftProxy, rightProxy, panelProxy ) => {
    leftProxy.centerY = rightProxy.centerY;
    leftProxy.right = panelProxy.left - 10;
  } );

  node.children = [ leftText, alignBox ];

  return overrideDispose( node, Node, () => resizer.dispose() );
}

/**
 * Demonstrates how flow constraint allows a parent and child to have disconnected position and bounds.
 *   - firstParent animates while its child firstChild remains still. The child is sometimes inside the parent bounds
 * and sometimes not.
 *   - secondParent stay still and secondChild stays still. secondChild is not rendered inside secondParent.
 *   - thirdParent animates while its child thirdChild remains still. The child is never inside the parent bounds.
 *
 * @param layoutBounds
 */
function demoDisconnectedFlow( layoutBounds: Bounds2 ): Node {
  const createLabeledBox = ( label: string, fill: TPaint, width: number, height: number ) => {
    return new Rectangle( 0, 0, width, height, {
      stroke: 'black',
      fill: fill,
      children: [
        new Text( label, { font: new PhetFont( 14 ), left: 7, bottom: height - 7 } )
      ]
    } );
  };

  const firstChild = createLabeledBox( 'First child', '#faa', 150, 30 );
  const secondChild = createLabeledBox( 'Second child', '#afa', 150, 30 );
  const thirdChild = createLabeledBox( 'Third child', '#aaf', 150, 30 );

  firstChild.y = 50;

  const firstParent = new Node( {
    children: [
      firstChild,
      createLabeledBox( 'First parent', null, 400, 400 )
    ]
  } );
  const secondParent = new Node( {
    children: [
      secondChild,
      createLabeledBox( 'Second parent', null, 400, 400 )
    ],
    scale: 0.75
  } );
  const thirdParent = new Node( {
    children: [
      thirdChild,
      createLabeledBox( 'Third parent', null, 400, 400 )
    ],
    scale: 0.5
  } );

  const scene = new Node( {
    children: [ firstParent, secondParent, thirdParent ]
  } );

  const cleanup = onElapsed( elapsedTime => {
    secondParent.x = layoutBounds.centerX;
    secondParent.y = layoutBounds.centerY;
    firstParent.x = layoutBounds.centerX - 410;
    firstParent.y = layoutBounds.centerY - 200 + Math.cos( elapsedTime ) * 100;
    thirdParent.x = secondParent.centerX + 300 + Math.cos( elapsedTime ) * 100;
    thirdParent.y = secondParent.centerY + Math.sin( elapsedTime ) * 100;
  } );

  const constraint = new FlowConstraint( scene, {
    layoutOriginProperty: new Vector2Property( new Vector2( 300, 100 ) )
  } );
  constraint.spacing = 10;
  constraint.insertCell( 0, new FlowCell( constraint, firstChild, null ) );
  constraint.insertCell( 1, new FlowCell( constraint, secondChild, null ) );
  constraint.insertCell( 2, new FlowCell( constraint, thirdChild, null ) );
  constraint.updateLayout();

  return overrideDispose( scene, Node, cleanup );
}

/**
 * Demos the orientation feature for alignment in flow and grid layouts. Essentially the x=0 or y=0 point of the nodes
 * are placed in the same vertical or horizontal line when 'origin' is used for alignment.
 * @param layoutBounds
 */
function demoOrigin( layoutBounds: Bounds2 ): Node {
  const originSize = 50;
  const originNode = new Path( new Shape().moveTo( -originSize, 0 ).lineTo( originSize, 0 ).moveTo( 0, originSize ).lineTo( 0, -originSize ), {
    stroke: 'rgba(0,0,0,0.3)'
  } );

  const flowBox = new FlowBox( {
    orientation: 'horizontal',
    align: 'origin',
    spacing: 5,
    lineSpacing: 5,
    children: [
      new Circle( 20, { fill: 'rgba(255,0,0,0.3)' } ),
      bigText( 'Text' ),
      normalText( 'Text' ),
      new Circle( 20, { fill: 'rgba(255,0,0,0.3)' } ),
      bigText( 'Text' ),
      normalText( 'text' ),
      new Circle( 20, { fill: 'rgba(255,0,0,0.3)' } ),
      bigText( 'Text' ),
      normalText( 'text' ),
      new Circle( 20, { fill: 'rgba(255,0,0,0.3)' } ),
      bigText( 'Text' ),
      normalText( 'text' )
    ],
    wrap: true,
    preferredWidth: 170,
    widthSizable: false,
    justify: 'left'
  } );

  const gridBox = new GridBox( {
    xAlign: 'origin',
    yAlign: 'origin',
    children: [
      new Circle( 20, { fill: 'rgba(255,0,0,0.3)', layoutOptions: { column: 0, row: 0 } } ),
      new Circle( 10, { fill: 'rgba(255,0,0,0.3)', layoutOptions: { column: 1, row: 0 } } ),
      new Circle( 15, { fill: 'rgba(255,0,0,0.3)', layoutOptions: { column: 0, row: 1 } } ),
      new Circle( 25, { fill: 'rgba(255,0,0,0.3)', layoutOptions: { column: 1, row: 1 } } )
    ]
  } );

  const content = new GridBox( {
    spacing: 15,
    children: [
      sectionText( 'FlowBox', { layoutOptions: { column: 0, row: 0 } } ),
      sectionText( 'GridBox', { layoutOptions: { column: 1, row: 0 } } ),
      new Node( {
        children: [
          originNode,
          flowBox
        ],
        layoutOptions: { column: 0, row: 1, yAlign: 'origin' }
      } ),
      new Node( {
        children: [
          new GridBackgroundNode( gridBox.constraint ),
          originNode,
          gridBox
        ],
        layoutOptions: { column: 1, row: 1, yAlign: 'origin' }
      } )
    ]
  } );

  return new AlignBox( content, { alignBounds: layoutBounds, xAlign: 'center', yAlign: 'center' } );
}

/**
 * 300 rectangles are created with random sizes inside a Flowbox to demonstrate a horizontal orientation with wrapping.
 * Stress test demonstrates how layout successfully handles a variety of rectangle sizes while still aligning content
 * as expected.
 * @param layoutBounds
 */
function demoFlowStressTest( layoutBounds: Bounds2 ): Node {
  return new FlowBox( {
    orientation: 'horizontal',
    wrap: true,
    justify: 'left',
    children: _.range( 0, 300 ).map( n => new Rectangle( 0, 0, dotRandom.nextDoubleBetween( 2, 20 ), dotRandom.nextDoubleBetween( 10, 50 ), {
      fill: colors[ dotRandom.nextIntBetween( 2, 8 ) ]
    } ) ),
    preferredWidth: 500,
    center: layoutBounds.center
  } );
}

/**
 * 900 rectangles are created with random sizes inside a gridBox. Each rectangle is inside its own cell.
 * Stress test demonstrates how layout successfully adjusts row and column sizes to accommodate a variety
 * of rectangle sizes.
 * @param layoutBounds
 */
function demoGridStressTest( layoutBounds: Bounds2 ): Node {
  return new GridBox( {
    autoColumns: 30,
    children: _.range( 0, 30 * 30 ).map( () => {
      return new Rectangle( 0, 0, dotRandom.nextDoubleBetween( 2, 20 ), dotRandom.nextDoubleBetween( 2, 20 ), {
        fill: colors[ dotRandom.nextIntBetween( 2, 8 ) ]
      } );
    } ),
    center: layoutBounds.center
  } );
}

/**
 * A resizer helps demonstrate how buttons can resize dynamically.
 * The rectangular push buttons in column 0 of the GridBox will adjust their bounds as the resizer animates.
 * The rectangular push buttons in column 1 of the GridBox maintain their bounds since their row height and
 * column width is not being affected by the resizer.
 * @param layoutBounds
 */
function demoSizableButtons( layoutBounds: Bounds2 ): Node {
  const resizer = createHorizontalResizer( 15, 30, 150 );

  const box = new GridBox( {
    spacing: 5,
    stretch: true,
    rows: [
      [
        new RectangularPushButton( {
          xAlign: 'stretch',
          yAlign: 'stretch',
          content: new GridBox( {
            grow: 1,
            rows: [
              [
                new Rectangle( 0, 0, 25, 25, { fill: colors[ 2 ] } ),
                new Rectangle( 0, 0, 25, 25, { fill: colors[ 4 ] } )
              ],
              [
                new Rectangle( 0, 0, 25, 25, { fill: colors[ 6 ] } ),
                new Rectangle( 0, 0, 25, 25, { fill: colors[ 8 ] } )
              ]
            ]
          } ),
          sizable: true
        } ),
        new RectangularPushButton( {
          content: new Rectangle( 0, 0, 50, 100, { fill: 'red' } ),
          sizable: true
        } )
      ],
      [
        new RectangularPushButton( {
          content: resizer,
          sizable: true
        } ),
        new RectangularPushButton( {
          content: new Rectangle( 0, 0, 100, 100, { fill: 'red' } ),
          sizable: true
        } )
      ]
    ],
    center: layoutBounds.center
  } );

  const alignBox = new AlignBox( box, { alignBounds: layoutBounds, margin: MARGIN } );
  return overrideDispose( alignBox, AlignBox, () => resizer.dispose() );
}

/**
 * Demonstrates and tests the functionality of the resizer.
 * @param layoutBounds
 */
function demoTest( layoutBounds: Bounds2 ): Node {
  const resizer = createHorizontalResizer( 15, 30, 150 );

  const button = new RectangularPushButton( {
    content: resizer,
    sizable: true
  } );
  button.translation = layoutBounds.center;

  return overrideDispose( button, RectangularPushButton, () => resizer.dispose() );
}

sun.register( 'LayoutScreenView', LayoutScreenView );