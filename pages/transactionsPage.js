import { expect } from "@playwright/test"

export class TransactionPage{
    constructor(page){
        this.page=page
        this.filterSection = page.getByTestId('filters-section')
        this.enterFilterDescription = page.getByText('Search')
        this.applyFilter = page.getByTestId('applyFilters')
        this.transactionTable = page.getByTestId('transactionTable');
        this.transactionHeaders = this.transactionTable.locator('thead th');
    }

    async goToTransactionPage() {
        await this.page.goto('/banking/transactions')
    }

    async validateTransactionPage(){
        await this.page.waitForURL('https://www.testerrank.com/banking/transactions')
    }

    async clickOnApplyFilter(){
        await this.applyFilter.click()
    }
    
    async enterFilterDes(transactionType){
        this.enterFilterDescription.fill(transactionType)
    }

    async verifyTransactionColumnNames() {

        const expectedHeaders = [
          'Date',
          'Description',
          'Reference',
          'Type',
          'Amount',
          'Balance',
          'Status'
        ];
    
        await expect(this.transactionHeaders).toHaveText(
          expectedHeaders
        );
    }

    async validateLatestTransaction(
        amount,
        transactionType,
        beneficiaryName,
        expectedBalance
      ) {
      
        const firstRow = this.transactionRows.first();
      
        await expect(firstRow.locator('td').nth(1))
          .toContainText(`${transactionType} to ${beneficiaryName}`);
      
        await expect(firstRow.locator('td').nth(3))
          .toHaveText('debit');
      
        await expect(firstRow.locator('td').nth(4))
          .toContainText(`₹${amount}`);
      
        await expect(firstRow.locator('td').nth(5))
          .toContainText(expectedBalance.toLocaleString('en-IN'));
      
        await expect(firstRow.locator('td').nth(6))
          .toHaveText('Success');
      }
}