export function useWidgetActions(props: any, emit: any) {
  const duplicateWidget = () => {
    emit('duplicate', props.data)
  }

  const deleteWidget = () => {
    emit('delete', props.data)
  }

  return {
    duplicateWidget,
    deleteWidget
  }
}
