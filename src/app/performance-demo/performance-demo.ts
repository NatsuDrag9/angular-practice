import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

// 9B: OnPush child — only re-renders when @Input reference changes
@Component({
  selector: 'user-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li>{{ user.name }} — {{ user.email }} ({{ user.role }})</li>
  `,
})
export class UserRow {
  @Input() user!: DemoUser;
}

// 9A/9B/9C: parent with default change detection for comparison
@Component({
  selector: 'performance-demo',
  imports: [UserRow],
  templateUrl: './performance-demo.html',
})
export class PerformanceDemo implements OnInit {
  protected users: DemoUser[] = [];
  protected useTrackBy = false;
  protected lastComputationMs = 0;
  protected renderCount = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.users = this.generateUsers(150);
  }

  // 9A: expensive computation — runs on every change detection cycle
  protected expensiveComputation(): number {
    this.renderCount++;
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 500_000; i++) result += Math.sqrt(i);
    this.lastComputationMs = Math.round(performance.now() - start);
    return result;
  }

  // 9C: trackBy — tells Angular to identify items by id, not object reference
  protected trackById(_index: number, user: DemoUser): number {
    return user.id;
  }

  protected onAddUser() {
    const nextId = this.users.length + 1;
    // immutable update — required for OnPush children to detect the change
    this.users = [
      ...this.users,
      { id: nextId, name: `User ${nextId}`, email: `user${nextId}@example.com`, role: 'viewer' },
    ];
  }

  protected onUpdateFirst() {
    // immutable update — creates new object so OnPush child re-renders
    this.users = this.users.map((u, i) =>
      i === 0 ? { ...u, name: `Updated at ${new Date().toLocaleTimeString()}` } : u
    );
  }

  protected onToggleTrackBy() {
    this.useTrackBy = !this.useTrackBy;
  }

  private generateUsers(count: number): DemoUser[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'editor' : 'viewer',
    }));
  }
}