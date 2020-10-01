// Copyright 2014-2020, University of Colorado Boulder

/**
 * A rectangular push button.  This is the file in which the appearance and behavior are brought together.
 *
 * This class inherits from RectangularButtonView, which contains all of the code that defines the button's appearance,
 * and adds the button's behavior by hooking up a button model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import pushButtonSoundPlayer from '../../../tambo/js/shared-sound-players/pushButtonSoundPlayer.js';
import Tandem from '../../../tandem/js/Tandem.js';
import sun from '../sun.js';
import PushButtonInteractionStateProperty from './PushButtonInteractionStateProperty.js';
import PushButtonModel from './PushButtonModel.js';
import RectangularButtonView from './RectangularButtonView.js';

class RectangularPushButton extends RectangularButtonView {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {Playable} - sound generation
      soundPlayer: pushButtonSoundPlayer,

      // {function} listener called when button is pushed.
      listener: _.noop,

      // tandem support
      tandem: Tandem.REQUIRED

    }, options );

    // Save the listener and add it after creating the button model.  This is done so that
    // the same code path is always used for adding listener, thus guaranteeing a consistent code path if addListener is
    // overridden, see https://github.com/phetsims/sun/issues/284.
    const listener = options.listener;
    options = _.omit( options, [ 'listener' ] );

    // Safe to pass through options to the PushButtonModel like "fireOnDown".  Other scenery options will be safely ignored.
    // Note it shares a tandem with this, so the emitter will be instrumented as a child of the button
    const buttonModel = new PushButtonModel( options ); // @public, listen only

    super( buttonModel, new PushButtonInteractionStateProperty( buttonModel ), options );

    // add the listener that was potentially saved above
    listener && this.addListener( listener );

    // sound generation
    const playSound = () => { options.soundPlayer.play(); };
    buttonModel.produceSoundEmitter.addListener( playSound );

    this.disposeRectangularPushButton = function() {
      buttonModel.dispose(); //TODO this fails when assertions are enabled, see sun#212
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'sun', 'AccordionBox', this );
  }

  // @public
  dispose() {

    // The order of operations here is important - the view needs to be disposed first so that it is unhooked from
    // the model before the model is disposed.  If the model is disposed first, the view ends up trying to change some
    // of its property values when it is disposed.  See https://github.com/phetsims/axon/issues/242.
    super.dispose();
    this.disposeRectangularPushButton();
  }
}

sun.register( 'RectangularPushButton', RectangularPushButton );
export default RectangularPushButton;