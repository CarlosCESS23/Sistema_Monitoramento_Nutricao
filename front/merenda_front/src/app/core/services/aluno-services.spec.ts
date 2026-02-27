import { TestBed } from '@angular/core/testing';

import { AlunoServices } from './aluno-services';

describe('AlunoServices', () => {
  let service: AlunoServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlunoServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
