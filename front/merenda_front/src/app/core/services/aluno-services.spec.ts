import { TestBed } from '@angular/core/testing';

// ✅ FIX: nome correto da classe (AlunoService) e caminho correto do arquivo (./aluno)
import { AlunoService } from './aluno';

describe('AlunoService', () => {
  let service: AlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlunoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});