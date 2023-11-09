import {isDefined, MedusaError} from 'medusa-core-utils';
import {EventBusService, TransactionBaseService} from '@medusajs/medusa';
import {CurrentTheme} from '../models/current-theme';
import ThemeRepository from '../repositories/theme';
import {Theme, ThemeList} from '../models/theme';

export default class ThemeService extends TransactionBaseService {
  private themeRepository: typeof ThemeRepository;
  protected readonly eventBus_: EventBusService;

  constructor(container) {
    super(container);
    this.themeRepository = container.themeRepository;
    this.eventBus_ = container.eventBusService;
  }

  async getCurrentTheme(): Promise<string> {
    const currentThemes = await CurrentTheme.find({});

    if (currentThemes.length < 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Current theme was not found`,
      );
    }
    const currentTheme = currentThemes[0];

    if ('theme_id' in currentTheme.metadata) {
      return currentTheme.metadata['theme_id'] as string;
    }

    return ""
  }

  async getListTheme(): Promise<ThemeList> {
    const themes = await this.themeRepository.find({});

    const currentTheme = await this.getCurrentTheme();
    console.log(currentTheme)

    return {
      themes,
      current_theme: currentTheme ? currentTheme : null,
    };
  }

  async create(theme: CreateThemeInput): Promise<Theme> {
    let _theme = this.themeRepository.create(theme);

    _theme = await this.themeRepository.save(_theme);

    return _theme;
  }

  async setCurrentTheme(themeId: string) {
    const currentThemes = await CurrentTheme.find({});

    if (currentThemes.length < 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Current theme was not found`,
      );
    }
    const currentTheme = currentThemes[0];
    currentTheme.metadata['theme_id'] = themeId;
    await currentTheme.save();
  }

  async retrieve(id: string): Promise<Theme> {
    const themeRepo = this.activeManager_.withRepository(this.themeRepository);
    const theme = await themeRepo.findOneById(id);

    if (!theme) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Theme with id: ${id} was not found`,
      );
    }

    return theme;
  }

    async update(
    id: string,
    themeObject: UpdateThemeInput,
  ): Promise<Theme> {
    const theme = await this.retrieve(id);

    for (const [key, value] of Object.entries(themeObject)) {
      if (isDefined(value)) {
        theme[key] = value;
      }
    }

    const result = await this.themeRepository.save(theme);

    return result;
  }

}

interface CreateThemeInput {
  title: string;
  thumbnail?: string;
  description?: string;
  url?: string;
}

interface UpdateThemeInput {
  title?: string;
  thumbnail?: string;
  description?: string;
  url?: string;
}
