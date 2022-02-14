// Copyright 2013-2022, University of Colorado Boulder

/**
 * Convenience type for creating a group of Checkboxes with vertical orientation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import merge from '../../phet-core/js/merge.js';
import optionize from '../../phet-core/js/optionize.js';
import { HStrut, VBoxOptions } from '../../scenery/js/imports.js';
import { Node } from '../../scenery/js/imports.js';
import { VBox } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import Checkbox from './Checkbox.js';
import sun from './sun.js';

type Item = {
  node: Node; // Label for the button
  property: Property<boolean>; // Property associated with the button
  options?: any; // Item-specific options to be passed to the checkbox
  tandem?: Tandem; // optional tandem for PhET-iO
};

type VerticalCheckboxGroupSelfOptions = {
  checkboxOptions?: any;
  touchAreaXDilation?: number;
  mouseAreaXDilation?: number;
};
export type VerticalCheckboxGroupOptions = VerticalCheckboxGroupSelfOptions & Omit<VBoxOptions, 'children'>;

class VerticalCheckboxGroup extends VBox {

  constructor( items: Item[], providedOptions?: VerticalCheckboxGroupOptions ) {

    const options = optionize<VerticalCheckboxGroupOptions, VerticalCheckboxGroupSelfOptions, VBoxOptions, 'spacing'>( {

      // {Object|null} options passed to constructor of the Checkbox
      checkboxOptions: null,

      // dilation of pointer areas for each checkbox, y dimension is computed
      touchAreaXDilation: 5,
      mouseAreaXDilation: 5,

      // supertype options
      spacing: 10, // vertical spacing
      align: 'left',
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    // Determine the max item width
    let maxItemWidth = 0;
    for ( let i = 0; i < items.length; i++ ) {
      maxItemWidth = Math.max( maxItemWidth, items[ i ].node.width );
    }

    // Create a checkbox for each item
    options.children = [];
    for ( let i = 0; i < items.length; i++ ) {

      const item = items[ i ];

      // Content for the checkbox. Add an invisible strut, so that checkboxes have uniform width.
      const content = new Node( {
        children: [ new HStrut( maxItemWidth ), item.node ]
      } );

      const checkbox = new Checkbox( content, item.property, merge( {}, options.checkboxOptions, item.options, {
        tandem: item.tandem || Tandem.OPTIONAL
      } ) );

      // set pointer areas, y dimensions are computed
      const yDilation = options.spacing / 2;
      checkbox.mouseArea = checkbox.localBounds.dilatedXY( options.mouseAreaXDilation, yDilation );
      checkbox.touchArea = checkbox.localBounds.dilatedXY( options.touchAreaXDilation, yDilation );

      options.children.push( checkbox );
    }

    super( options );
  }
}

sun.register( 'VerticalCheckboxGroup', VerticalCheckboxGroup );
export default VerticalCheckboxGroup;