import RequestService, { RequestErrorValues, RequestValues } from './request';

describe('request', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          json: () => {
            return {};
          },
        });
      });
    });
  });

  describe('titleFilter', () => {
    const newFilter = RequestService.titleFilter;
    it('has empty title', () => {
      expect(newFilter('')).toBe('Please fill up the title.');
    });
    it('has too short title', () => {
      expect(newFilter('abcde')).toBe('Please enter at least 10 characters.');
    });
    it('has valid title', () => {
      expect(newFilter('abcde fghijkl')).toBe(undefined);
    });
  });

  describe('detailFilter', () => {
    const newFilter = RequestService.detailFilter;
    it('has empty detail', () => {
      expect(newFilter('')).toBe('Please fill up the detail.');
    });
    it('has too short detail', () => {
      expect(newFilter('abcde')).toBe('Please enter at least 20 characters.');
    });
    it('has valid detail', () => {
      expect(newFilter('abcde fghijkl abcde fghijkl abcde fghijkl abcde fghijkl')).toBe(undefined);
    });
  });

  describe('validateSignUp', () => {
    let newFilter: (values: RequestValues) => Promise<RequestErrorValues>;
    let values: RequestValues;

    beforeEach(() => {
      newFilter = RequestService.validateSubmitRequest;
      values = {
        title: 'abcde fghijk',
        district: 'Auckland',
        suburb: 'Albany',
        category: 'repair',
        detail: 'abcde fghijkl abcde fghijkl abcde fghijkl abcde fghijkl',
        pay: 21.2,
        images: [],
      };
    });

    it('has valid values', async () => {
      expect(await newFilter(values)).toEqual({});
    });
    it('has wrong title', async () => {
      values.title = '';
      expect((await newFilter(values)).title).not.toBeFalsy();
    });
    it('has wrong detail', async () => {
      values.detail = '';
      expect((await newFilter(values)).detail).not.toBeFalsy();
    });
  });

  describe('uploadImage', () => {
    const mockFile = new File([''], 'filename', { type: 'text/html' });
    it('returs json', async () => {
      expect(await RequestService.uploadImage(mockFile)).toEqual({});
    });
  });

  describe('handleSubmitConstructor', () => {
    const values: RequestValues = {
      title: 'abcde fghijk',
      district: 'Auckland',
      suburb: 'Albany',
      category: 'repair',
      detail: 'abcde fghijkl abcde fghijkl abcde fghijkl abcde fghijkl',
      pay: 21.2,
      images: [],
    };
    let push: Function;
    let newSubmitHandler: (values: RequestValues) => Promise<void>;

    beforeEach(() => {
      push = jest.fn();
      newSubmitHandler = RequestService.handleSubmitConstructor('token', 'url', push);
    });

    it('does not push without id', async () => {
      await newSubmitHandler(values);
      expect(push).not.toHaveBeenCalled();
    });
    it('push with id', async () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve({
            json: () => {
              return { id: 'abcd1234' };
            },
          });
        });
      });
      await newSubmitHandler(values);
      expect(push).toHaveBeenCalled();
    });
  });
});
