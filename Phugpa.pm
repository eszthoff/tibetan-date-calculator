package Calendar::Phugpa;

use strict;
use Carp qw/croak/;
use Time::JulianDay qw/julian_day inverse_julian_day/;
use POSIX qw/floor ceil/;

=head1 NAME

Calendar::Phugpa - Perl extension for to perform Tibetan calendrical calculations according
to the Phugpa tradition.

=head1 DESCRIPTION

The calculations in this module basically implement the formulas in Svante Janson,
"Tibetan Calendar Mathematics".  See the paper for details.

We are using year 806 as the epoch for all calculations.

=cut

our @ISA = ();
our $VERSION = '0.0020120906';
our @EXPORT_OK = ();
our @EXPORT = ();

# calendrical constants: month calculations
use constant	S1	=> 65/804;
use constant	Y0	=> 806;
use constant	S0	=> 743/804;
use constant	P1	=> 77/90;
use constant	P0	=> 139/180;
use constant	ALPHA	=> 1 + 827/1005;
use constant	BETA	=> 123;

# calendrical constants: day calculations
use constant	M1	=> 167025/5656;
use constant	M2	=> M1 / 30;
use constant	M0	=> 2015501 + 4783 / 5656;
use constant	S2	=> S1 / 30;
use constant	A1	=> 253 / 3528;
use constant	A2	=> 1/28;
# use constant A2	=> 1/28 + 1/105840; # not used; see Janson, p. 17, bottom.
use constant	A0	=> 475/3528;

# fixed tables
use constant	MOON_TAB => (0, 5, 10, 15, 19, 22, 24, 25);
use constant	SUN_TAB	 => (0, 6, 10, 11);

# western weekdays
use constant	WEEKDAYS => qw/Sun Mon Tue Wed Thu Fri Sat/;

# year elements & animals
use constant	YEAR_ELEMENTS	=> qw/Wood Fire Earth Iron Water/;
use constant	YEAR_ANIMALS	=> qw/Mouse Ox Tiger Rabbit Dragon Snake Horse Sheep Monkey Bird Dog Pig/;
use constant	YEAR_GENDER	=> qw/Male Female/;

### HELPER FUNCTIONS

# frac($a) = the fractional part of a number
sub frac {
  my $a = shift;
  $a - floor($a);
}

# mod($a, $b) is like $a % $b, but also works with non-integer $a
sub mod {
  my ($a, $b) = @_;
  (floor($a) % $b) + frac($a);
}

# amod($a, $b) = $a % $b, but from 1..$b instead of 0..$b-1
sub amod {
  my ($a, $b) = @_;
  mod($a, $b) || $b;
}

# week day from julian day
sub weekday {
  my $jd = shift;
  (WEEKDAYS)[($jd + 1) % 7];
}

# figure out the animal and element for a tibetan year
sub year_attributes {
  my $year = shift;
  my $Y = $year->{tib_year};

  $year->{animal} = (YEAR_ANIMALS)[($Y + 1) % 12];
  $year->{element} = (YEAR_ELEMENTS)[(($Y - 1) / 2) % 5];
  $year->{gender} = (YEAR_GENDER)[($Y + 1) % 2];

  $year;
}

=head1 FUNCTIONS

=head2 rabjung_year($cycle_no, $year_no)

Figures out a year's info based on the Tibetan calendar, ex. the 3rd year of
the 15th Rabjung calendrical cycle.

Inputs:
  $cycle_no : number of the cycle
  $year_no  : number of the year within the cycle, from 1 to 60.

Returns: a hashref with the following elements:
  cycle_no  : number of the cycle
  year_no   : number of the year within the cycle, from 1 to 60.
  western_year : western year during which most of the given tibetan year falls
  tib_year  : tibetan year number (i.e western year + 127)

=cut

sub rabjung_year {
  my ($cycle_no, $year_no) = @_;
  croak "Year number must be between 1 and 60" unless $year_no >= 1 && $year_no <= 60;

  my $year = {
    cycle_no	=> $cycle_no,
    year_no	=> $year_no,
    western_year => 966 + $year_no + 60 * $cycle_no,
  };
  $year->{tib_year} = $year->{western_year} + 127;

  year_attributes($year);
}

=head2 western_year($year)

Figures out a year's info from a Western calendar year number, ex. 2008.
Returns: same as rabjung_year().

=cut

sub western_year {
  my ($w_year) = @_;

  my $year = {
    cycle_no	=> ceil(($w_year - 1026) / 60),
    year_no	=> amod($w_year - 6, 60),
    tib_year	=> $w_year + 127,
    western_year => $w_year,
  };

  year_attributes($year);
}

=head2 tibetan_year($year)

Figures out a year's info from a Tibetan calendar year number, ex. 2135.
Returns: same as rabjung_year().

=cut

sub tibetan_year {
  my $y = shift;
  western_year($y - 127);
}

# from_month_count($n)
#
# Figures out the Tibetan year number, month number within the year, and whether
# this is a leap month, from a "month count" number.  See Svante Janson,
# "Tibetan Calendar Mathematics", p.8 ff.
#
# Returns: ($year, $month, $is_leap_month)

sub from_month_count {
  my $n = shift;
  my $x = ceil(12 * S1 * $n + ALPHA);
  my $M = amod($x, 12);
  my $Y = ($x - $M) / 12 + Y0 + 127;
  my $l = (ceil(12 * S1 * ($n + 1) + ALPHA) == $x);

  ($Y, $M, $l);
}

# to_month_count($year, $month, $is_leap_month)
#
# This is the reverse of from_month_count(): from a Tibetan year, month number
# and leap month indicator, calculates the "month count" based on the epoch.

sub to_month_count {
  my ($Y, $M, $l) = @_;
  $Y -= 127;		# the formulas on Svante's paper use western year numbers
  $l = ($l ? 1 : 0);
  floor((12 * ($Y - Y0) + $M - ALPHA - (1 - 12 * S1) * $l) / (12 * S1));
}

=head2 has_leap_month($year, $month)

Calculates whether a given Tibetan year and month number is duplicated, i.e
is preceded by a leap month.

=cut

sub has_leap_month {
  my ($Y, $M) = @_;
  my $Mp = 12 * ($Y - 127 - Y0) + $M;
  ((2 * $Mp) % 65 == BETA % 65) || ((2 * $Mp) % 65 == (BETA + 1) % 65);
}

### MORE INTERNAL FUNCTIONS

# This and the following functions implement partial formulas in Svante's paper.

# mean_date($day, $month_count)
sub mean_date {
  my ($d, $n) = @_;
  $n * M1 + $d * M2 + M0;
}

# mean_sun($day, $month_count)
sub mean_sun {
  my ($d, $n) = @_;
  $n * S1 + $d * S2 + S0;
}

# moon_anomaly($day, $month_count)
sub moon_anomaly {
  my ($d, $n) = @_;
  $n * A1 + $d * A2 + A0;
}

# moon_tab_int($i): moon_tab for integer values.
sub moon_tab_int {
  my $i = shift;
  $i = $i % 28;
  return ((MOON_TAB)[$i]) if $i <= 7;
  return ((MOON_TAB)[14-$i]) if $i <= 14;
  return -((MOON_TAB)[$i-14]) if $i <= 21;
  return -((MOON_TAB)[28-$i]);
}

# moon_tab($i): Moon tab, with linear interpolation.
sub moon_tab {
  my $i = shift;
  my $a = moon_tab_int(floor($i));
  my $x = frac($i);
  if ($x) {
    my $b = moon_tab_int(floor($i) + 1);
    my $ad = ($b - $a) * $x;
    $a += $ad;
  }
  $a;
}

# moon_equ($day, $month_count): Equation of the moon.
sub moon_equ {
  my ($d, $n) = @_;
  moon_tab(28 * moon_anomaly($d, $n));
}

# sun_tab_int($i): Sun tab for integer values
sub sun_tab_int {
  my $i = shift;
  $i = $i % 12;
  return ((SUN_TAB)[$i]) if $i <= 3;
  return ((SUN_TAB)[6-$i]) if $i <= 6;
  return -((SUN_TAB)[$i-6]) if $i <= 9;
  return -((SUN_TAB)[12-$i]);
}

# sun_tab($i): sun tab, with linear interpolation.
sub sun_tab {
  my $i = shift;
  my $a = sun_tab_int(floor($i));
  my $x = frac($i);
  if ($x) {
    my $b = sun_tab_int(floor($i) + 1);
    my $ad = ($b - $a) * $x;
    $a += $ad;
  }
  $a;
}

# sun_equ($day, $month_count): Equation of the sun.
sub sun_equ {
  my ($d, $n) = @_;
  sun_tab(12 * (mean_sun($d, $n) - 1/4));
}

# true_date($day, $month_count)
sub true_date {
  my ($d, $n) = @_;
  mean_date($d, $n) + moon_equ($d, $n) / 60 - sun_equ($d, $n) / 60;
}

# day_before($day, $month_count): substract 1 day from a date
sub day_before {
  my ($d, $n) = @_;
  $d == 1 ? (30, $n - 1) : ($d - 1, $n);
}

=head2 tib_to_julian($year, $month, $is_leap_month, $day)

Gives the Julian date for a Tibetan year, month number (leap or not) and
Tibetan day.

Does not check that the tibetan day actually exists:
 - If given the date of a skipped day, will return the same Julian date as the
   day before.
 - If given the date of a duplicate day, returns the Julian date of the second
   of the two.

=cut

sub tib_to_julian {
  my ($Y, $M, $l, $d) = @_;
  my $n = to_month_count($Y, $M, $l);
  floor(true_date($d, $n));
}

=head2 tib_to_western($year, $month, $leap_month, $day, $leap_day)

Calculates full information for a given Tibetan date, given by Tibetan
year number (ex. 2135), month number (1 to 12), leap month (boolean),
day number, and leap day (boolean).

For duplicated days, just as with duplicated months, the "main" day or month is
the second, and the "leap" day or month is the first.

Returns a hashref with the following fields:
  year           - a hashref as returned by rabjung_year and similar functions above

  month_no       - tibetan month number (as passed)
  is_leap_month  - boolean, whether this is a leap month (this is the same as the
		   passed "leap month" boolean, except if you try to get dates
		   within a non-existing leap month, in which case is_leap_month
		   is returned as false
  has_leap_month - boolean, whether this year and month is duplicated (regardless
		   of whether the date is calculated within the leap or the main month)

  day_no	 - the day number within the Tibetan month, as passed
  skipped_day	 - whether this is a skipped day, which does not figure in the
		   Tibetan calendar
  is_leap_day    - boolean, whether this is a leap day (same as the passed $leap_day
                   value, except if you request a leap day when there isn't one)
  has_leap_day   - whether this is a duplicated day (regardless of whether we are
                   calculating info about the main or the leap day)

  western_date	 - the Western date ("YYYY-MM-DD") corresponding to the Tibetan day.
  weekday        - weekday ("Sun", "Mon", etc) of the western_date
  julian_date    - the Julian day number for this Western date

=cut

sub tib_to_western {
  my ($Y, $M, $l, $d, $ld) = @_;
  my $jd = tib_to_julian($Y, $M, $l, $d);

  # also calculate the Julian date of the previous Tib. day
  my $n = to_month_count($Y, $M, $l);
  my $b_jd = floor(true_date(day_before($d, $n)));

  # figure out leap months, leap days & skipped days
  my $has_leap_month = has_leap_month($Y, $M);
  my $has_leap_day = ($jd == $b_jd + 2);
  my $skipped_day = ($jd == $b_jd);
  $ld &&= $has_leap_day;

  # figure out western date info for the main or leap day
  $jd-- if $ld;
  my ($w_y, $w_m, $w_d) = inverse_julian_day($jd);

  my $day = {
    year		=> tibetan_year($Y),

    month_no		=> $M,
    is_leap_month	=> ($l && $has_leap_month),
    has_leap_month	=> $has_leap_month,

    day_no		=> $d,
    skipped_day		=> $skipped_day,
    is_leap_day		=> $ld,
    has_leap_day	=> $has_leap_day,

    western_date	=> sprintf("%.4d-%.2d-%.2d", $w_y, $w_m, $w_d),
    julian_date		=> $jd,
    weekday		=> weekday($jd),
  };

  $day;
}

# to calculate Tibetan dates from western ones, we use a binary search algorithm
# within a span of 2 years.  for this we use a variant of true_date which takes
# a linear "tibetan day number", defined as $day_no + 30 * $month_no.
sub tib_day_to_julian {
  my $d = shift;
  my $n = floor(($d - 1) / 30);
  $d = ($d % 30) || 30;
  floor(true_date($d, $n));
}

=head2 western_to_tib($western_year, $month, $day)

Calculates a Tibetan date for a given western date.  This does a binary search,
and is therefore much slower than tib_to_western().

Returns: ($tib_year, $tib_month, $leap_month, $tib_day, $leap_day)

=cut

# The algorithm could be much improved by using the reverse of mean_date()
# to start with, and then using the fact that julian dates and "tibetan day
# numbers" have a quasi-linear relation.

sub western_to_tib {
  my ($w_y, $w_m, $w_d) = @_;
  my $jd = julian_day(@_);

  my $tib_year1 = $w_y + 126;
  my $tib_year2 = $w_y + 128;

  my $n1 = to_month_count($tib_year1, 1, 1);
  my $n2 = to_month_count($tib_year2, 1, 1);

  my $dn1 = 1 + 30 * $n1;
  my $dn2 = 1 + 30 * $n2;

  my $jd1 = tib_day_to_julian($dn1);
  my $jd2 = tib_day_to_julian($dn2);
  croak "Binary search algo is wrong" unless $jd1 <= $jd && $jd <= $jd2;

  while ($dn1 < $dn2 - 1 && $jd1 < $jd2 - 1) {
    my $ndn = floor(($dn1 + $dn2) / 2);
    my $njd = tib_day_to_julian($ndn);
    if ($njd < $jd) {
      $dn1 = $ndn;
      $jd1 = $njd;
    } else {
      $dn2 = $ndn;
      $jd2 = $njd;
    }
  }

  # so we found it; put it in $dn2 & $jd2.
  # if the western date is the 1st of a duplicated tib. day, then $jd1 == $jd - 1 and
  #   $jd2 == $jd + 1, and the corresponding tib. day number is the one from $jd2.
  if ($jd1 == $jd) {
    $jd2 = $jd1;
    $dn2 = $dn1;
  }

  # figure out the real tib. date: year, month, leap month, day number, leap day.
  my $leap_day = ($jd2 > $jd);
  my $n = floor(($dn2 - 1) / 30);
  $dn2 = ($dn2 % 30) || 30;
  my ($Y, $M, $l) = from_month_count($n);
  ($Y, $M, $l, $dn2, $leap_day);
}

=head2 losar($tib_year)

Calculates the Western date for Losar (Tibetan new year) of a given Tibetan
year number (ex. 2137).

Returns: "YYYY-MM-DD" string.

=cut

sub losar {
  my $Y = shift;
  my $jd = 1 + tib_to_julian($Y - 1, 12, 0, 30);
  my ($w_y, $w_m, $w_d) = inverse_julian_day($jd);
  sprintf("%.4d-%.2d-%.2d", $w_y, $w_m, $w_d);
}

=head2 tibetan_month($year, $month, $leap_month)

Calculates full information about a Tibetan month: whether it is
duplicated or not, and the western start and end date for it.

Returns a hashref with the following fields:
  year           - a hashref as returned by rabjung_year and similar functions above
  month_no       - tibetan month number (as passed)
  is_leap_month  - boolean, whether this is a leap month (this is the same as the
		   passed "leap month" boolean, except if you try to get dates
		   within a non-existing leap month, in which case is_leap_month
		   is returned as false
  has_leap_month - boolean, whether this year and month is duplicated (regardless
		   of whether the date is calculated within the leap or the main month)
  start_date     - Western date of the 1st of the month (or 2nd if the 1st is skipped),
		   in "YYYY-MM-DD" format
  end_date       - Western date of the 30th of the Tib. month.

The start_date and end_date correspond to the leap month if $leap_month is passed,
otherwise to the main month (i.e the second of the two).

=cut

sub tibetan_month {
  my ($Y, $M, $l) = @_;

  my $has_leap = has_leap_month($Y, $M);
  $l &&= $has_leap;

  # calculate the Julian date 1st and last of the month
  my $n = to_month_count($Y, $M, $l);
  my $jd1 = 1 + floor(true_date(30, $n - 1));
  my $jd2 = floor(true_date(30, $n));

  my $month = {
    year		=> tibetan_year($Y),
    month_no		=> $M,
    is_leap_month	=> $l,
    has_leap_month	=> $has_leap,
    start_date		=> sprintf("%.4d-%.2d-%.2d", inverse_julian_day($jd1)),
    end_date		=> sprintf("%.4d-%.2d-%.2d", inverse_julian_day($jd2)),
  };

  $month;
}

=head2 year_calendar($tib_year)

Generate a calendar for a whole Tibetan year, given by Tib. year number.

Returns: a hashref containing the year's info, including each of the months
in succession within $year->{months}.  Each month includes all the days in
succession within $month->{days}.

=cut

sub year_calendar {
  my $Y = shift;
  my $year = tibetan_year($Y);

  # loop over the months, inserting leap months before the main ones
  my @months;
  foreach my $M (1 .. 12) {
    if (has_leap_month($Y, $M)) {
      push @months, generate_month($Y, $M, 1);
    }
    push @months, generate_month($Y, $M, undef);
  }

  $months[0]{days}[0]{special_day} = 'Losar';

  $year->{months} = \@months;
  $year;
}

use constant SPECIAL_DAYS	=> {
	8	=> "Medicine Buddha & Tara Day",
	10	=> "Guru Rinpoche Day",
	15	=> "Amitabha Buddha Day; Full Moon",
	25	=> "Dakini Day",
	29	=> "Dharmapala Day",
	30	=> "Shakyamuni Buddha Day; New Moon",
};

# figure out if a day is special; if it is skipped, return its speciality so it can be
# applied to the next day.  on dup days, the special one is the 1st.
sub special_day {
  my ($no, $day, $carry_special) = @_;

  # if we are carrying over a special feature from the day before, apply it
  $day->{special_day} = $carry_special . ' (carried over)' if $carry_special;

  return undef unless SPECIAL_DAYS()->{$no};
  return SPECIAL_DAYS()->{$no} if $day->{skipped_day};
  return undef if $day->{has_leap_day} && !$day->{is_leap_day};

  # carried over special features can overlap with the ones for the day itself!
  if ($day->{special_day}) {
    $day->{special_day} .= '; ' . SPECIAL_DAYS()->{$no};
  } else {
    $day->{special_day} = SPECIAL_DAYS()->{$no};
  }

  undef;
}

# generate a month with all its days
sub generate_month {
  my ($Y, $M, $l) = @_;
  my $month = tibetan_month($Y, $M, $l);
  my $carry_special;

  # loop over the days, taking care of dup and missing days
  my @days;
  foreach my $d (1 .. 30) {
    my $day = tib_to_western($Y, $M, $l, $d, undef);

    # insert leap days before their main day
    if ($day->{has_leap_day}) {
      my $day2 = tib_to_western($Y, $M, $l, $d, 1);
      $carry_special = special_day($d, $day2, $carry_special);
      push @days, $day2;
    }

    $carry_special = special_day($d, $day, $carry_special);
    next if $day->{skipped_day};
    push @days, $day;
  }

  $month->{days} = \@days;
  $month;
}

1;

