// Copyright 2014-2021, University of Colorado Boulder

/**
 * A DerivedProperty that maps ButtonModel states to the states needed by the radio button view.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import sun from '../sun.js';
import RadioButtonInteractionState from './RadioButtonInteractionState.js';
import IProperty from '../../../axon/js/IProperty.js';
import ButtonModel from './ButtonModel.js';

class RadioButtonInteractionStateProperty<T> extends DerivedProperty<RadioButtonInteractionState, [ boolean, boolean, boolean, boolean, T ]> {

  /**
   * @param buttonModel
   * @param property - the axon Property set by the button
   * @param value - the value set by the button
   */
  constructor( buttonModel: ButtonModel, property: IProperty<T>, value: T ) {
    super(
      [ buttonModel.focusedProperty, buttonModel.overProperty, buttonModel.looksOverProperty, buttonModel.looksPressedProperty, property ],
      ( focused, over, looksOver, looksPressed, propertyValue ) => {
        const isSelected = ( propertyValue === value );
        return looksOver && !( looksPressed || isSelected ) ? RadioButtonInteractionState.OVER :
               ( over || focused ) && looksPressed ? RadioButtonInteractionState.PRESSED :
               isSelected ? RadioButtonInteractionState.SELECTED :
               RadioButtonInteractionState.DESELECTED;
      },
      { valueType: RadioButtonInteractionState }
    );
  }
}

sun.register( 'RadioButtonInteractionStateProperty', RadioButtonInteractionStateProperty );
export default RadioButtonInteractionStateProperty;