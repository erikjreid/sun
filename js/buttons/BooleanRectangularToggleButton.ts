// Copyright 2013-2022, University of Colorado Boulder

/**
 * This toggle button uses a boolean Property and a trueNode and falseNode to display its content.
 */

import Tandem from '../../../tandem/js/Tandem.js';
import BooleanToggleNode from '../BooleanToggleNode.js';
import sun from '../sun.js';
import RectangularToggleButton, { RectangularToggleButtonOptions } from './RectangularToggleButton.js';
import { Node } from '../../../scenery/js/imports.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../axon/js/Property.js';

type SelfOptions = EmptyObjectType;

export type BooleanRectangularToggleButtonOptions = SelfOptions & StrictOmit<RectangularToggleButtonOptions, 'content'>;

export default class BooleanRectangularToggleButton extends RectangularToggleButton<boolean> {

  private readonly disposeBooleanRectangularToggleButton: () => void;

  /**
   * @param trueNode - shown when booleanProperty is true
   * @param falseNode - shown when booleanProperty is false
   * @param booleanProperty
   * @param providedOptions
   */
  public constructor( trueNode: Node, falseNode: Node, booleanProperty: Property<boolean>,
                      providedOptions?: BooleanRectangularToggleButtonOptions ) {

    const content = new BooleanToggleNode( booleanProperty, trueNode, falseNode );

    const options = optionize<BooleanRectangularToggleButtonOptions, SelfOptions, RectangularToggleButtonOptions>()( {
      content: content,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( false, true, booleanProperty, options );

    this.disposeBooleanRectangularToggleButton = () => {
      content.dispose();
    };
  }

  public override dispose(): void {
    this.disposeBooleanRectangularToggleButton();
    super.dispose();
  }
}

sun.register( 'BooleanRectangularToggleButton', BooleanRectangularToggleButton );
