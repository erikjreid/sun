// Copyright 2014-2020, University of Colorado Boulder

/**
 * An interactive round push button.  This is the file in which the appearance and behavior are brought together.
 *
 * This class inherits from RoundButtonView, which contains all of the
 * code that defines the button's appearance, and adds the button's behavior
 * by hooking up a button model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import pushButtonSoundPlayer from '../../../tambo/js/shared-sound-players/pushButtonSoundPlayer.js';
import Tandem from '../../../tandem/js/Tandem.js';
import sun from '../sun.js';
import PushButtonInteractionStateProperty from './PushButtonInteractionStateProperty.js';
import PushButtonModel from './PushButtonModel.js';
import RoundButtonView from './RoundButtonView.js';

class RoundPushButton extends RoundButtonView {

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

    // Save the listener and add it after creating the button model. This is done so that
    // the same code path is always used for adding listener, thus guaranteeing a consistent code path if addListener is
    // overridden, see https://github.com/phetsims/sun/issues/284.
    const listener = options.listener;
    options = _.omit( options, [ 'listener' ] );

    // @public - listening only
    // Note it shares a tandem with this, so the emitter will be instrumented as a child of the button
    const buttonModel = new PushButtonModel( options );

    super( buttonModel, new PushButtonInteractionStateProperty( buttonModel ), options );

    // add the listener that was potentially saved above
    this.addListener( listener );

    // sound generation
    const playSound = () => { options.soundPlayer.play(); };
    buttonModel.produceSoundEmitter.addListener( playSound );

    // dispose function
    this.disposeRoundPushButton = () => {
      buttonModel.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'sun', 'RoundPushButton', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {

    // The order of operations here is important - the view needs to be disposed first so that it is unhooked from
    // the model before the model is disposed.  If the model is disposed first, the view ends up trying to change some
    // of its Property values when it is disposed.  See https://github.com/phetsims/axon/issues/242.
    super.dispose();
    this.disposeRoundPushButton();
  }
}

sun.register( 'RoundPushButton', RoundPushButton );
export default RoundPushButton;