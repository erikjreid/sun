// Copyright 2014-2022, University of Colorado Boulder

/**
 * RectangularStickyToggleButton is a rectangular toggle button that toggles the value of a Property between 2 values.
 * It has a different look (referred to as 'up' and 'down') for the 2 values.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import IProperty from '../../../axon/js/IProperty.js';
import sun from '../sun.js';
import RectangularButton, { RectangularButtonOptions } from './RectangularButton.js';
import StickyToggleButtonInteractionStateProperty from './StickyToggleButtonInteractionStateProperty.js';
import StickyToggleButtonModel from './StickyToggleButtonModel.js';

type SelfOptions = {};

export type RectangularStickyToggleButtonOptions = SelfOptions & RectangularButtonOptions;

export default class RectangularStickyToggleButton<T> extends RectangularButton {

  private readonly disposeRectangularStickyToggleButton: () => void;

  /**
   * @param valueUp - value when the toggle is in the 'up' position
   * @param valueDown - value when the toggle is in the 'down' position
   * @param valueProperty - axon Property that can be either valueUp or valueDown.
   * @param providedOptions
   */
  public constructor( valueUp: T, valueDown: T, valueProperty: IProperty<T>, providedOptions?: RectangularStickyToggleButtonOptions ) {

    // Note it shares a tandem with this, so the emitter will be instrumented as a child of the button
    const buttonModel = new StickyToggleButtonModel( valueUp, valueDown, valueProperty, providedOptions );
    const stickyToggleButtonInteractionStateProperty = new StickyToggleButtonInteractionStateProperty( buttonModel );

    super( buttonModel, stickyToggleButtonInteractionStateProperty, providedOptions );

    this.disposeRectangularStickyToggleButton = () => {
      buttonModel.dispose();
    };
  }

  public override dispose(): void {
    this.disposeRectangularStickyToggleButton();
    super.dispose();
  }
}

sun.register( 'RectangularStickyToggleButton', RectangularStickyToggleButton );