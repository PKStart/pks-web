import { Injectable } from '@angular/core'
import { KoreanDictItem, ProxyRequest } from 'pks-common'
import { differenceInDays, parse } from 'date-fns'
import { StoreKeys } from '../../../constants/constants'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { SettingsStore } from '../../shared/services/settings.store'
import { PreResults, DictionaryResult } from './korean.types'

interface KoreanState {
  kor: string[]
  hun: string[]
  randomWord: DictionaryResult | undefined
  loading: boolean
  disabled: boolean
}

const initialState: KoreanState = {
  kor: [],
  hun: [],
  randomWord: undefined,
  loading: false,
  disabled: false,
}

interface StoredWordList {
  items: KoreanDictItem[]
  lastFetch: string
}

@Injectable({ providedIn: 'root' })
export class KoreanService extends Store<KoreanState> {
  public loading$ = this.select(state => state.loading)
  public disabled$ = this.select(state => state.disabled)
  public randomWord$ = this.select(state => state.randomWord)

  constructor(
    private apiService: ApiService,
    private settingsStore: SettingsStore,
    private notificationService: NotificationService
  ) {
    super(initialState)
    if (!settingsStore.koreanUrl) {
      this.setState({ disabled: true })
      return
    }
    const stored = localStorage.getItem(StoreKeys.KOREAN)
    if (!stored) {
      this.fetchWordlist()
    } else {
      const parsed = JSON.parse(stored) as StoredWordList
      if (differenceInDays(new Date(), parse(parsed.lastFetch)) > 6) {
        this.fetchWordlist()
      } else {
        this.createLists(parsed.items)
        this.getRandomWord()
      }
    }
  }

  public fetchWordlist(): void {
    if (this.state.disabled) {
      return
    }
    this.setState({ loading: true })
    this.apiService
      .post<ProxyRequest, KoreanDictItem[]>(ApiRoutes.PROXY_KOREAN, {
        url: this.settingsStore.koreanUrl as string,
      })
      .subscribe({
        next: res => {
          localStorage.setItem(
            StoreKeys.KOREAN,
            JSON.stringify({
              lastFetch: new Date().toISOString(),
              items: res,
            })
          )
          this.setState({ loading: false })
          this.createLists(res)
          this.getRandomWord()
        },
        error: err => {
          this.setState({ loading: false })
          this.notificationService.showError(
            'Failed to fetch Korean word list. ' + err.error.message
          )
        },
      })
  }

  public getTranslations(word: string): DictionaryResult[] {
    const hun = this.state.hun
    const kor = this.state.kor
    word = word.trim().toLowerCase()
    // const regex = new RegExp('\\b' + word + '\\b') // does not work with korean :(
    const regexOnOwn = new RegExp("(?:^|\\s|-|'|~)" + word + "(?:$|\\s|,|-|'|~)")
    const regexInParentheses = new RegExp('(?:\\()' + word + '(?:\\))')

    const preResults: PreResults = {
      exact: [],
      onOwn: [],
      startsWith: [],
      inParentheses: [],
      partial: [],
    }

    for (let i = 0; i < hun.length; i++) {
      // check for exact match
      if (word === hun[i].toLowerCase()) {
        preResults.exact.push({ word: hun[i], translate: kor[i] })
      } else if (word === kor[i].toLowerCase()) {
        preResults.exact.push({ word: kor[i], translate: hun[i] })

        // check for word on it's own in the entry
      } else if (regexOnOwn.test(hun[i].toLowerCase())) {
        preResults.onOwn.push({ word: hun[i], translate: kor[i] })
      } else if (regexOnOwn.test(kor[i])) {
        preResults.onOwn.push({ word: kor[i], translate: hun[i] })

        // check for match starting with word
      } else if (hun[i].toLowerCase().startsWith(word)) {
        preResults.startsWith.push({ word: hun[i], translate: kor[i] })
      } else if (kor[i].toLowerCase().startsWith(word)) {
        preResults.startsWith.push({ word: kor[i], translate: hun[i] })

        // check for word on it's own but in parentheses
      } else if (regexInParentheses.test(hun[i].toLowerCase())) {
        preResults.inParentheses.push({ word: hun[i], translate: kor[i] })
      } else if (regexInParentheses.test(kor[i])) {
        preResults.inParentheses.push({ word: kor[i], translate: hun[i] })

        // check for match including word anywhere
      } else if (hun[i].toLowerCase().includes(word)) {
        preResults.partial.push({ word: hun[i], translate: kor[i] })
      } else if (kor[i].toLowerCase().includes(word)) {
        preResults.partial.push({ word: kor[i], translate: hun[i] })
      }
    }
    return this.combineResults(preResults)
  }

  public getRandomWord(): void {
    const max = this.state.hun.length
    const rnd = Math.floor(Math.random() * max)
    this.setState({
      randomWord: {
        word: this.state.kor[rnd],
        translate: this.state.hun[rnd],
      },
    })
  }

  private combineResults(preResults: PreResults): DictionaryResult[] {
    // finalize results array
    let results: DictionaryResult[] = []
    results = results.concat(
      preResults.exact,
      preResults.onOwn,
      preResults.startsWith,
      preResults.inParentheses,
      preResults.partial
    )
    return results
  }

  private createLists(items: KoreanDictItem[]): void {
    const kor: string[] = []
    const hun: string[] = []

    items.forEach(item => {
      kor.push(item.kor)
      hun.push(item.hun)
    })

    this.setState({
      kor,
      hun,
    })
  }
}
