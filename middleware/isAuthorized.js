import { SnackbarProgrammatic as Snackbar } from 'buefy'

export default function ({ redirect, store }) {
  if (
    !store.state.connected ||
    !store.state.selectedAccount ||
    Number(store.state.chainId) !== 4
  ) {
    redirect('/')

    Snackbar.open({
      actionText: 'OK',
      message: `You're going to need to <strong style="color: white;">Connect</strong> to Rinkeby if you want to go there!`,
      type: 'is-warning',
      position: 'is-top',
      duration: 6000,
      queue: false,
    })
  }
}
