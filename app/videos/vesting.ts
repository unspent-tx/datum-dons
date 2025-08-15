import { Video } from ".";
import { people as p } from "../people/people";

export const vesting: Video = {
  index: 5,
  participants: {
    don: p.newman,
    capos: [p.unspentTx, p.gZero, p.lewis],
  },
  id: "mlfnabOMEK8",
  title: "Vesting",
  url: "https://www.youtube.com/watch?v=mlfnabOMEK8",
  shorts: [],
  code: `
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}
use cocktail.{key_signed, valid_after}
use mocktail.{
  complete, invalid_before, mock_pub_key_hash, mock_utxo_ref, mocktail_tx,
  required_signer_hash,
}

pub type VestingDatum {
  /// POSIX time in milliseconds, e.g. 1672843961000
  lock_until: Int,
  /// Owner's credentials
  owner: VerificationKeyHash,
  /// Beneficiary's credentials
  beneficiary: VerificationKeyHash,
}

validator vesting {
  // In principle, scripts can be used for different purpose (e.g. minting
  // assets). Here we make sure it's only used when 'spending' from a eUTxO
  spend(
    datum_opt: Option<VestingDatum>,
    _redeemer: Data,
    _input: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum_opt
    or {
      key_signed(tx.extra_signatories, datum.owner),
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }

  else(_) {
    fail
  }
}

type TestCase {
  is_owner_signed: Bool,
  is_beneficiary_signed: Bool,
  is_lock_time_passed: Bool,
}

fn get_test_tx(test_case: TestCase) {
  let TestCase { is_owner_signed, is_beneficiary_signed, is_lock_time_passed } =
    test_case
  mocktail_tx()
    |> required_signer_hash(is_owner_signed, mock_pub_key_hash(1))
    |> required_signer_hash(is_beneficiary_signed, mock_pub_key_hash(2))
    |> invalid_before(is_lock_time_passed, 1672843961001)
    |> complete()
}

fn vesting_datum() {
  VestingDatum {
    lock_until: 1672843961000,
    owner: mock_pub_key_hash(1),
    beneficiary: mock_pub_key_hash(2),
  }
}

test success_unlocking() {
  let output_reference = mock_utxo_ref(0, 1)
  let datum = Some(vesting_datum())
  let test_case =
    TestCase {
      is_owner_signed: True,
      is_beneficiary_signed: True,
      is_lock_time_passed: True,
    }
  let tx = get_test_tx(test_case)
  vesting.spend(datum, Void, output_reference, tx)
}
    `,
};
