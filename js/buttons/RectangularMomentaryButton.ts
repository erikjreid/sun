// Copyright 2015-2022, University of Colorado Boulder

/**
 * RectangularMomentaryButton is a rectangular momentary button that toggles a Property between 2 values.
 * The 'off value' is the value when the button is not pressed.
 * The 'on value' is the value when the button is pressed.
 *
 * TODO: Not supported with alternative input, see https://github.com/phetsims/scenery/issues/1117
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../axon/js/IProperty.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import Tandem from '../../../tandem/js/Tandem.js';
import sun from '../sun.js';
import MomentaryButtonInteractionStateProperty from './MomentaryButtonInteractionStateProperty.js';
import MomentaryButtonModel from './MomentaryButtonModel.js';
import RectangularButton, { RectangularButtonOptions } from './RectangularButton.js';

type SelfOptions = EmptyObjectType;

export type RectangularMomentaryButtonOptions = SelfOptions & RectangularButtonOptions;

export default class RectangularMomentaryButton<T> extends RectangularButton {

  private readonly disposeRectangularMomentaryButton: () => void;

  /**
   * @param valueOff - value when the button is in the off state
   * @param valueOn - value when the button is in the on state
   * @param property
   * @param [providedOptions]
   */
  public constructor( valueOff: T, valueOn: T, property: IProperty<T>, providedOptions?: RectangularMomentaryButtonOptions ) {

    const options = optionize<RectangularMomentaryButtonOptions, SelfOptions, RectangularButtonOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // Note it shares a tandem with this, so the emitter will be instrumented as a child of the button
    const buttonModel = new MomentaryButtonModel( valueOff, valueOn, property, options );

    super( buttonModel, new MomentaryButtonInteractionStateProperty( buttonModel ), options );

    this.disposeRectangularMomentaryButton = () => {
      buttonModel.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'sun', 'RectangularMomentaryButton', this );
  }

  public override dispose(): void {
    this.disposeRectangularMomentaryButton();
    super.dispose();
  }
}

sun.register( 'RectangularMomentaryButton', RectangularMomentaryButton );