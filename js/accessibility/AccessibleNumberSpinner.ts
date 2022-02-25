// Copyright 2018-2022, University of Colorado Boulder

/**
 * A trait for subtypes of Node, used to make the Node behave like a 'number' input with assistive technology.
 * An accessible number spinner behaves like:
 *
 * - Arrow keys increment/decrement the value by a specified step size.
 * - Page Up and Page Down increments/decrements value by an alternative step size, usually larger than default.
 * - Home key sets value to its minimum.
 * - End key sets value to its maximum.
 *
 * This number spinner is different than typical 'number' inputs because it does not support number key control. It
 * was determined that an input of type range is the best match for a PhET Number Spinner, with a custom role
 * description with aria-roledescription. See https://github.com/phetsims/sun/issues/497 for history on this
 * decision.
 *
 * This trait mixes in a "parent" mixin to handle general "value" formatting and aria-valuetext updating, see
 * AccessibleValueHandler.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Michael Barlow (PhET Interactive Simulations)
 */

import CallbackTimer from '../../../axon/js/CallbackTimer.js';
import Emitter from '../../../axon/js/Emitter.js';
import validate from '../../../axon/js/validate.js';
import assertHasProperties from '../../../phet-core/js/assertHasProperties.js';
import Constructor from '../../../phet-core/js/types/Constructor.js';
import inheritance from '../../../phet-core/js/inheritance.js';
import IntentionalAny from '../../../phet-core/js/IntentionalAny.js';
import optionize from '../../../phet-core/js/optionize.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import { IInputListener, KeyboardUtils, Node, SceneryEvent, SceneryListenerFunction } from '../../../scenery/js/imports.js';
import sun from '../sun.js';
import sunStrings from '../sunStrings.js';
import AccessibleValueHandler, { AccessibleValueHandlerOptions } from './AccessibleValueHandler.js';

const numberSpinnerRoleDescriptionString = sunStrings.a11y.numberSpinnerRoleDescription;

type AccessibleNumberSpinnerSelfOptions = {
  timerDelay?: number,
  timerInterval?: number
}

type AccessibleNumberSpinnerOptions = AccessibleNumberSpinnerSelfOptions & AccessibleValueHandlerOptions;

/**
 * @param Type
 * @param optionsArgPosition - zero-indexed number that the options argument is provided at
 */
const AccessibleNumberSpinner = <SuperType extends Constructor>( Type: SuperType, optionsArgPosition: number ) => {

  assert && assert( _.includes( inheritance( Type ), Node ), 'Only Node subtypes should compose Voicing' );

  // Unfortunately, nothing can be private or protected in this class, see https://github.com/phetsims/scenery/issues/1340#issuecomment-1020692592
  return class extends AccessibleValueHandler( Type, optionsArgPosition ) {

    // Manages timing must be disposed
    _callbackTimer: CallbackTimer;

    // @protected - emits events when increment and decrement actions occur, but only for changes
    // of keyboardStep (not pageKeyboardStep or shiftKeyboardStep)
    incrementDownEmitter: Emitter<[ boolean ]>; // @protected
    decrementDownEmitter: Emitter<[ boolean ]>; // @protected

    _disposeAccessibleNumberSpinner: () => void;

    constructor( ...args: IntentionalAny[] ) {

      const providedOptions = args[ optionsArgPosition ] as AccessibleValueHandlerOptions;

      assert && providedOptions && assert( Object.getPrototypeOf( providedOptions ) === Object.prototype,
        'Extra prototype on AccessibleSlider options object is a code smell (or probably a bug)' );

      const options = optionize<AccessibleNumberSpinnerOptions, AccessibleNumberSpinnerSelfOptions, AccessibleValueHandlerOptions>( {
        timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
        timerInterval: 100, // fire continuously at this frequency (milliseconds),

        ariaOrientation: Orientation.VERTICAL // by default, number spinners should be oriented vertically
      }, providedOptions );

      args[ optionsArgPosition ] = options;

      super( ...args );

      const thisNode = this as unknown as Node;

      // members of the Node API that are used by this trait
      assertHasProperties( this, [ 'addInputListener' ] );

      this._callbackTimer = new CallbackTimer( {
        delay: options.timerDelay,
        interval: options.timerInterval
      } );

      this.incrementDownEmitter = new Emitter( { parameters: [ { valueType: 'boolean' } ] } );
      this.decrementDownEmitter = new Emitter( { parameters: [ { valueType: 'boolean' } ] } );

      thisNode.setPDOMAttribute( 'aria-roledescription', numberSpinnerRoleDescriptionString );

      // a callback that is added and removed from the timer depending on keystate
      let downCallback: SceneryListenerFunction | null = null;
      let runningTimerCallbackEvent: Event | null = null; // {Event|null}

      // handle all accessible event input
      const accessibleInputListener: IInputListener = {
        keydown: ( event: SceneryEvent<KeyboardEvent> ) => {
          if ( ( this as unknown as Node ).enabledProperty.get() ) {

            // check for relevant keys here
            if ( KeyboardUtils.isRangeKey( event.domEvent ) ) {

              const domEvent = event.domEvent! as KeyboardEvent;

              // If the meta key is down we will not even call the keydown listener of the supertype, so we need
              // to be sure that default behavior is prevented so we don't receive `input` and `change` events.
              // See AccessibleValueHandler.handleInput for information on these events and why we don't want
              // to change in response to them.
              domEvent.preventDefault();

              // When the meta key is down Mac will not send keyup events so do not change values or add timer
              // listeners because they will never be removed since we fail to get a keyup event. See
              if ( !domEvent.metaKey ) {
                if ( !this._callbackTimer.isRunning() ) {
                  this._accessibleNumberSpinnerHandleKeyDown( event );

                  downCallback = this._accessibleNumberSpinnerHandleKeyDown.bind( this, event );
                  runningTimerCallbackEvent = domEvent;
                  this._callbackTimer.addCallback( downCallback );
                  this._callbackTimer.start();
                }
              }
            }
          }
        },
        keyup: ( event: SceneryEvent<KeyboardEvent> ) => {

          const key = KeyboardUtils.getEventCode( event.domEvent );

          if ( KeyboardUtils.isRangeKey( event.domEvent ) ) {
            if ( runningTimerCallbackEvent && key === KeyboardUtils.getEventCode( runningTimerCallbackEvent ) ) {
              this._emitKeyState( event.domEvent!, false );
              this._callbackTimer.stop( false );
              this._callbackTimer.removeCallback( downCallback );
              downCallback = null;
              runningTimerCallbackEvent = null;
            }

            this.handleKeyUp( event );
          }
        },
        blur: ( event: SceneryEvent<FocusEvent> ) => {

          // if a key is currently down when focus leaves the spinner, stop callbacks and emit that the
          // key is up
          if ( downCallback ) {
            assert && assert( runningTimerCallbackEvent !== null, 'key should be down if running downCallback' );

            this._emitKeyState( runningTimerCallbackEvent!, false );
            this._callbackTimer.stop( false );
            this._callbackTimer.removeCallback( downCallback );
          }

          this.handleBlur( event );
        },
        input: this.handleInput.bind( this ),
        change: this.handleChange.bind( this )
      };
      thisNode.addInputListener( accessibleInputListener );

      this._disposeAccessibleNumberSpinner = () => {
        this._callbackTimer.dispose();

        // emitters owned by this instance, can be disposed here
        this.incrementDownEmitter.dispose();
        this.decrementDownEmitter.dispose();

        thisNode.removeInputListener( accessibleInputListener );
      };
    }

    /**
     * Handle the keydown event and emit events related to the user interaction. Ideally, this would
     * override AccessibleValueHandler.handleKeyDown, but overriding is not supported with PhET Trait pattern.
     */
    _accessibleNumberSpinnerHandleKeyDown( event: SceneryEvent<KeyboardEvent> ) {
      assert && assert( event.domEvent, 'must have a domEvent' );
      this.handleKeyDown( event );
      this._emitKeyState( event.domEvent!, true );
    }

    /**
     * Emit events related to the keystate of the spinner. Typically used to style the spinner during keyboard
     * interaction.
     *
     * @param domEvent - the code of the key changing state
     * @param isDown - whether or not event was triggered from down or up keys
     */
    _emitKeyState( domEvent: Event, isDown: boolean ) {
      validate( domEvent, { valueType: Event } );
      if ( KeyboardUtils.isAnyKeyEvent( domEvent, [ KeyboardUtils.KEY_UP_ARROW, KeyboardUtils.KEY_RIGHT_ARROW ] ) ) {
        this.incrementDownEmitter.emit( isDown );
      }
      else if ( KeyboardUtils.isAnyKeyEvent( domEvent, [ KeyboardUtils.KEY_DOWN_ARROW, KeyboardUtils.KEY_LEFT_ARROW ] ) ) {
        this.decrementDownEmitter.emit( isDown );
      }
    }

    dispose() {
      this._disposeAccessibleNumberSpinner();

      super.dispose();
    }
  };
};

sun.register( 'AccessibleNumberSpinner', AccessibleNumberSpinner );

export default AccessibleNumberSpinner;